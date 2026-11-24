"""Non-destructive frame extraction, AI-text artifact removal, and WebP encoding."""

from __future__ import annotations

import pathlib
import subprocess
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
FFMPEG = r"D:\Utility\KEEP\CBase26\ffmpeg\ffmpeg.exe"
SOURCE_VIDEO = ROOT / "wan22_output_2K_upscaled.mp4"
OUT_DESKTOP = ROOT / "public" / "frames" / "desktop"
OUT_MOBILE = ROOT / "public" / "frames" / "mobile"
POSTER_PATH = ROOT / "public" / "frames" / "poster.webp"

WIDTH = 2560
HEIGHT = 1440
FRAME_COUNT = 79


def raised_cosine_1d(length: int) -> np.ndarray:
    """Return a smooth 0..1 raised-cosine ramp."""
    if length <= 1:
        return np.ones(1, dtype=np.float32)
    t = np.linspace(0.0, np.pi, length, dtype=np.float32)
    return 0.5 * (1.0 - np.cos(t))


def build_rect_feather_mask(
    height: int,
    width: int,
    x0: int,
    x1: int,
    y0: int,
    y1: int,
    feather: int = 28,
) -> np.ndarray:
    """Create a 2D feather mask inside [y0:y1, x0:x1] with raised-cosine edges."""
    w = x1 - x0
    h = y1 - y0
    mx = np.ones(w, dtype=np.float32)
    my = np.ones(h, dtype=np.float32)
    fx = min(feather, w // 3)
    fy = min(feather, h // 3)
    if fx > 0:
        ramp_x = raised_cosine_1d(fx)
        mx[:fx] = ramp_x
        mx[-fx:] = ramp_x[::-1]
    if fy > 0:
        ramp_y = raised_cosine_1d(fy)
        my[:fy] = ramp_y
        my[-fy:] = ramp_y[::-1]
    mask = np.zeros((height, width), dtype=np.float32)
    mask[y0:y1, x0:x1] = np.outer(my, mx)
    return mask[:, :, None]


def decode_all_frames() -> np.ndarray:
    """Decode all 79 source frames at native 2560x1440 rgb24."""
    cmd = [
        FFMPEG,
        "-v",
        "error",
        "-i",
        str(SOURCE_VIDEO),
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-",
    ]
    raw = subprocess.check_output(cmd)
    expected = FRAME_COUNT * HEIGHT * WIDTH * 3
    if len(raw) != expected:
        raise RuntimeError(f"Expected {expected} bytes, got {len(raw)}")
    return np.frombuffer(raw, dtype=np.uint8).reshape((FRAME_COUNT, HEIGHT, WIDTH, 3)).copy()


def clean_ai_text_artifacts(frames: np.ndarray) -> None:
    """Conceal unintended opening AI text without touching character or branches."""
    clean_bg_tl = frames[22].astype(np.float32)
    clean_bg_rt = frames[35].astype(np.float32)

    # Mask A: Top-left gibberish present in frames 0..19
    mask_a = build_rect_feather_mask(HEIGHT, WIDTH, x0=295, x1=545, y0=215, y1=295, feather=28)
    for f in range(20):
        src = frames[f].astype(np.float32)
        blended = src * (1.0 - mask_a) + clean_bg_tl * mask_a
        frames[f] = np.clip(np.rint(blended), 0, 255).astype(np.uint8)

    # Mask B: Three lines of center-right serif text in frames 0..33.
    # Surgical per-line masks keep full clearance from the rotating botanical twig:
    #   L1 ("Daain Bnn Sinat"): y=372..494, x=1864..2385
    #   L2 ("A Mnnlane Disne at"): y=490..598, x=1820..2445
    #   L3 ("Bniala Bama Bnanv"): y=595..708, x=1825..2430
    mask_l1 = build_rect_feather_mask(HEIGHT, WIDTH, x0=1864, x1=2385, y0=372, y1=494, feather=12)
    mask_l2 = build_rect_feather_mask(HEIGHT, WIDTH, x0=1820, x1=2445, y0=486, y1=604, feather=14)
    mask_l3 = build_rect_feather_mask(HEIGHT, WIDTH, x0=1820, x1=2430, y0=586, y1=712, feather=16)
    combined_rt_mask = np.maximum(mask_l1, np.maximum(mask_l2, mask_l3))

    for f in range(34):
        src = frames[f].astype(np.float32)
        blended = src * (1.0 - combined_rt_mask) + clean_bg_rt * combined_rt_mask
        frames[f] = np.clip(np.rint(blended), 0, 255).astype(np.uint8)

    # Programmatic verification across all text-bearing zones
    tl_residual = int(frames[:20, 230:275, 315:525].max())
    l1_residual = int(frames[:34, 392:482, 1877:2350].max())
    l2_residual = int(frames[:34, 504:582, 1838:2418].max())
    l3_residual = int(frames[:34, 608:688, 1845:2400].max())
    rt_residual = max(l1_residual, l2_residual, l3_residual)
    print(f"Artifact check -> top-left max={tl_residual}, L1={l1_residual}, L2={l2_residual}, L3={l3_residual}")
    if tl_residual >= 20 or rt_residual >= 20:
        raise RuntimeError("Residual AI text detected after cleaning!")


def encode_webp_sequence(
    frames: np.ndarray,
    out_dir: pathlib.Path,
    target_w: int,
    target_h: int,
    quality: int,
) -> None:
    """Pipe RGB frames into ffmpeg libwebp encoder."""
    if not out_dir.exists():
        out_dir.mkdir(parents=True, exist_ok=True)
    cmd = [
        FFMPEG,
        "-y",
        "-v",
        "error",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-r",
        "16",
        "-i",
        "-",
        "-vf",
        f"scale={target_w}:{target_h}:flags=lanczos",
        "-c:v",
        "libwebp",
        "-q:v",
        str(quality),
        "-compression_level",
        "6",
        "-start_number",
        "0",
        str(out_dir / "frame_%03d.webp"),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    assert proc.stdin is not None
    proc.stdin.write(frames.tobytes())
    proc.stdin.close()
    rc = proc.wait()
    if rc != 0:
        raise RuntimeError(f"ffmpeg webp encoding failed with code {rc}")


def encode_poster(frame0: np.ndarray) -> None:
    """Encode high-priority poster frame_000 for immediate preloading."""
    if not POSTER_PATH.parent.exists():
        POSTER_PATH.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        FFMPEG,
        "-y",
        "-v",
        "error",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-i",
        "-",
        "-vf",
        "scale=1920:1080:flags=lanczos",
        "-c:v",
        "libwebp",
        "-q:v",
        "84",
        "-compression_level",
        "6",
        str(POSTER_PATH),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    assert proc.stdin is not None
    proc.stdin.write(frame0.tobytes())
    proc.stdin.close()
    rc = proc.wait()
    if rc != 0:
        raise RuntimeError(f"poster encoding failed with code {rc}")


def main() -> None:
    print("Decoding source video...")
    frames = decode_all_frames()
    print("Cleaning unintended AI text artifacts...")
    clean_ai_text_artifacts(frames)
    print("Encoding desktop WebP sequence (1920x1080)...")
    encode_webp_sequence(frames, OUT_DESKTOP, 1920, 1080, quality=82)
    print("Encoding mobile WebP sequence (1080x608)...")
    encode_webp_sequence(frames, OUT_MOBILE, 1080, 608, quality=78)
    print("Encoding priority poster...")
    encode_poster(frames[0])
    d_size = sum(p.stat().st_size for p in OUT_DESKTOP.glob("*.webp")) / (1024 * 1024)
    m_size = sum(p.stat().st_size for p in OUT_MOBILE.glob("*.webp")) / (1024 * 1024)
    print(f"Done! Desktop: {d_size:.2f} MB (79 files), Mobile: {m_size:.2f} MB (79 files)")


if __name__ == "__main__":
    main()
