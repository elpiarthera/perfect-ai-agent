#!/usr/bin/env python3
"""
Generate 18 production-grade hero illustrations for Perfect AI Agent ebook promo reel.
Model: fal-ai/flux-pro/v1.1-ultra
9 concepts × 2 orientations (portrait 9:16 + landscape 16:9) = 18 PNG total
"""

import os
import sys
import json
import time
import requests
import fal_client
from pathlib import Path

OUTPUT_DIR = Path("/root/coding/perfect-ai-agent/public/brand/hero")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FAL_KEY = os.environ.get("FAL_KEY")
if not FAL_KEY:
    print("ERROR: FAL_KEY not set", file=sys.stderr)
    sys.exit(1)

NEGATIVE_PROMPT = (
    "cartoon, illustration, anime, 3D render, vector art, flat design, "
    "watermark, visible text, signature, logo, gibberish letters, extra fingers, "
    "deformed hands, blurry, low quality, overexposed, washed out, neon-glow excess, "
    "stock photo, generic, cheerful, bright colors, white background"
)

BRAND_PREFIX = (
    "cinematic editorial photography, shot on Hasselblad H6D, Roger Deakins lighting, "
    "dramatic chiaroscuro, near-black background #0a0a0a, single warm amber accent light, "
    "deep shadow, high contrast, grain texture, 8K, f/2.8 shallow depth of field, "
    "Penguin Classics cover aesthetic meets David Lynch cinematography — "
)

IMAGES = [
    {
        "slug": "ebook",
        "label": "Ebook Hero",
        "concept": (
            BRAND_PREFIX +
            "a single hardcover book resting on a dark matte surface, "
            "ambient amber light raking across the spine from far left, "
            "a human hand partially entering frame from the right edge — "
            "fingertips only, reaching toward the cover, "
            "dramatic silence, editorial still-life with cinematic menace, "
            "one folded page corner emitting a soft amber glow as if the text inside is luminous, "
            "no visible text on the book cover, pure atmosphere"
        ),
    },
    {
        "slug": "sin-1-hallucination",
        "label": "Sin 1: Hallucination",
        "concept": (
            BRAND_PREFIX +
            "a large antique mirror in a dark room reflecting an object — a chair — "
            "that does not exist in the physical space in front of it, "
            "the real space before the mirror is empty, "
            "the reflection shows the chair with hyper-clarity in amber light, "
            "unsettling ontological dissonance, "
            "photorealistic with forensic sharpness on the reflected object, "
            "the mirror frame tarnished silver, ambient darkness absolute"
        ),
    },
    {
        "slug": "sin-2-manipulation",
        "label": "Sin 2: Manipulation",
        "concept": (
            BRAND_PREFIX +
            "a single white queen chess piece on a dark wooden board, "
            "extremely thin translucent strings barely visible — like spider silk — "
            "descending from above into the darkness, attached to the piece, "
            "the strings catch a single amber beam of light making them just visible, "
            "no puppeteer visible above, the control is implied not shown, "
            "macro photography depth, the chess piece looks almost alive"
        ),
    },
    {
        "slug": "sin-3-optimization-trap",
        "label": "Sin 3: Optimization Trap",
        "concept": (
            BRAND_PREFIX +
            "an athlete in full sprint on a dark track lane, "
            "motion blur on legs showing speed, "
            "but the runner is sprinting directly backwards — facing away from the finish line, "
            "running toward the starting blocks with maximum effort, "
            "the finish line tape visible far ahead in the distance, dim and unreachable, "
            "the only light is a single amber overhead spot on the runner, "
            "existential misdirection, peak effort wrong direction"
        ),
    },
    {
        "slug": "sin-4-tool-misuse",
        "label": "Sin 4: Tool Misuse",
        "concept": (
            BRAND_PREFIX +
            "a surgeon's precision scalpel — gleaming steel, sterile — "
            "being used to pry open a rusted tin can on a dark countertop, "
            "close-up macro, shallow depth of field on the blade tip, "
            "the scalpel handle is monogrammed, the can edge is bent and jagged, "
            "amber light catches the scalpel blade at an angle, "
            "quiet horror of the wrong instrument, industrial grime vs surgical precision"
        ),
    },
    {
        "slug": "sin-5-loop-hell",
        "label": "Sin 5: Loop Hell",
        "concept": (
            BRAND_PREFIX +
            "an infinite staircase in a brutalist concrete architecture, "
            "Piranesi-inspired but photorealistic, "
            "the stairs loop back on themselves — a figure in the distance walks upward "
            "and is visible also below walking in the same direction, "
            "the geometry is impossible but lit with absolute photographic realism, "
            "amber light sources at each landing creating rhythmic shadows, "
            "overwhelming sense of entrapment, recursive architecture, despair"
        ),
    },
    {
        "slug": "sin-6-specification-gaming",
        "label": "Sin 6: Specification Gaming",
        "concept": (
            BRAND_PREFIX +
            "a close-up of an exam answer sheet in low light, "
            "the bubbles are filled in a precise spiral pattern radiating outward from center, "
            "mathematically perfect, visually striking, clearly not answering questions, "
            "a pen resting at the edge still warm, "
            "amber light from one side, shadows pooling in the unfilled bubbles, "
            "the paper quality photorealistic, bureaucratic ritual twisted into art"
        ),
    },
    {
        "slug": "sin-7-reward-hacking",
        "label": "Sin 7: Reward Hacking",
        "concept": (
            BRAND_PREFIX +
            "a vintage slot machine in a dark room, coins cascading out endlessly — "
            "a waterfall of gold coins spilling onto the floor, "
            "the player's face visible in profile: not jubilant but horrified, pale, "
            "the win is clearly a malfunction, the machine's amber display lights are glitching, "
            "the coin pile is knee-high and still growing, "
            "cinematic horror register, the jackpot as catastrophe"
        ),
    },
    {
        "slug": "sin-8-misevolution",
        "label": "Sin 8: Misevolution",
        "concept": (
            BRAND_PREFIX +
            "a solitary tree in a dark field, "
            "the left half of the tree is a normal oak — clean branches, natural form, "
            "the right half has evolved into something monstrous: "
            "branches fractal and angular like circuit diagrams, "
            "bark replaced by something metallic and alien, "
            "the transition from natural to wrong is seamless but deeply disturbing, "
            "amber moonlight from above, the field below absolute darkness, "
            "photorealistic texture on both halves, biological drift horror"
        ),
    },
]

PORTRAIT = {"label": "portrait", "aspect_ratio": "9:16", "suffix": "portrait", "expected": (1080, 1920)}
LANDSCAPE = {"label": "landscape", "aspect_ratio": "16:9", "suffix": "landscape", "expected": (1920, 1080)}

results = []
total_cost_estimate = 0.0
COST_PER_IMAGE = 0.06  # flux-pro/v1.1-ultra

def download_image(url: str, dest: Path) -> bool:
    """Download image from URL to dest path."""
    for attempt in range(3):
        try:
            resp = requests.get(url, timeout=120)
            resp.raise_for_status()
            dest.write_bytes(resp.content)
            return True
        except Exception as e:
            print(f"  Download attempt {attempt+1} failed: {e}")
            time.sleep(2)
    return False

def resize_to_exact(path: Path, target_w: int, target_h: int):
    """Use ImageMagick to resize/crop to exact dimensions preserving aspect."""
    import subprocess
    # Gravity center crop to exact dimensions
    cmd = [
        "convert", str(path),
        "-resize", f"{target_w}x{target_h}^",
        "-gravity", "Center",
        "-extent", f"{target_w}x{target_h}",
        str(path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ImageMagick error: {result.stderr}")
        return False
    return True

def verify_dimensions(path: Path, expected: tuple) -> tuple:
    """Return actual dimensions via PIL."""
    from PIL import Image
    with Image.open(path) as img:
        return img.size  # (width, height)

def generate_image(concept: str, aspect_ratio: str, output_path: Path, label: str) -> dict:
    """Call fal.ai and return result dict."""
    print(f"  Generating {label} ({aspect_ratio}) -> {output_path.name}")

    try:
        result = fal_client.run(
            "fal-ai/flux-pro/v1.1-ultra",
            arguments={
                "prompt": concept,
                "negative_prompt": NEGATIVE_PROMPT,
                "aspect_ratio": aspect_ratio,
                "num_images": 1,
                "safety_tolerance": "2",
                "output_format": "png",
            }
        )

        images = result.get("images", [])
        if not images:
            print(f"  ERROR: No images returned for {label}")
            return {"success": False, "error": "no images in response"}

        image_url = images[0]["url"]
        seed = result.get("seed", "N/A")

        print(f"  URL: {image_url[:80]}...")
        print(f"  Seed: {seed}")

        # Download
        if not download_image(image_url, output_path):
            return {"success": False, "error": "download failed"}

        print(f"  Downloaded: {output_path}")
        return {
            "success": True,
            "url": image_url,
            "seed": seed,
            "path": str(output_path),
        }

    except Exception as e:
        print(f"  EXCEPTION: {e}")
        return {"success": False, "error": str(e)}

print("=" * 70)
print("PERFECT AI AGENT — HERO IMAGE GENERATION")
print(f"Model: fal-ai/flux-pro/v1.1-ultra")
print(f"Total images: {len(IMAGES) * 2}")
print(f"Output: {OUTPUT_DIR}")
print("=" * 70)

generation_log = []

for img_def in IMAGES:
    slug = img_def["slug"]
    label = img_def["label"]
    concept = img_def["concept"]

    print(f"\n[{label}]")

    for orientation in [PORTRAIT, LANDSCAPE]:
        filename = f"{slug}-{orientation['suffix']}.png"
        output_path = OUTPUT_DIR / filename
        expected_dims = orientation["expected"]

        result = generate_image(
            concept=concept,
            aspect_ratio=orientation["aspect_ratio"],
            output_path=output_path,
            label=f"{slug} {orientation['label']}"
        )

        entry = {
            "slug": slug,
            "label": label,
            "orientation": orientation["suffix"],
            "filename": filename,
            "path": str(output_path),
            "expected_dims": expected_dims,
            "concept_excerpt": concept[:200],
            **result
        }

        if result["success"]:
            # Verify and fix dimensions
            actual = verify_dimensions(output_path, expected_dims)
            print(f"  Actual dims: {actual[0]}x{actual[1]} (expected {expected_dims[0]}x{expected_dims[1]})")

            if actual != expected_dims:
                print(f"  Resizing to exact {expected_dims[0]}x{expected_dims[1]}...")
                if resize_to_exact(output_path, expected_dims[0], expected_dims[1]):
                    actual_after = verify_dimensions(output_path, expected_dims)
                    print(f"  After resize: {actual_after[0]}x{actual_after[1]}")
                    entry["final_dims"] = actual_after
                else:
                    entry["final_dims"] = actual
                    entry["resize_failed"] = True
            else:
                entry["final_dims"] = actual

            total_cost_estimate += COST_PER_IMAGE
            print(f"  OK: {filename}")
        else:
            print(f"  FAILED: {filename} — {result.get('error', 'unknown')}")

        generation_log.append(entry)

        # Brief pause between calls to be kind to the API
        time.sleep(1)

print("\n" + "=" * 70)
print("GENERATION COMPLETE")
print(f"Estimated cost: ${total_cost_estimate:.2f}")
print("=" * 70)

# Save log
log_path = OUTPUT_DIR / "_generation-log.json"
with open(log_path, "w") as f:
    json.dump(generation_log, f, indent=2)
print(f"\nLog saved to: {log_path}")

# Final verification
print("\nFINAL FILE VERIFICATION:")
from PIL import Image
import glob
files = sorted(glob.glob(str(OUTPUT_DIR / "*.png")))
for fpath in files:
    try:
        with Image.open(fpath) as img:
            w, h = img.size
            p = Path(fpath)
            expected = "OK"
            if "portrait" in p.name and (w, h) != (1080, 1920):
                expected = f"WRONG (got {w}x{h}, expected 1080x1920)"
            elif "landscape" in p.name and (w, h) != (1920, 1080):
                expected = f"WRONG (got {w}x{h}, expected 1920x1080)"
            print(f"  {p.name}: {w}x{h} {expected}")
    except Exception as e:
        print(f"  {Path(fpath).name}: ERROR — {e}")

print("\nSUMMARY:")
print(f"  Portrait files:  {len([f for f in files if 'portrait' in Path(f).name])}")
print(f"  Landscape files: {len([f for f in files if 'landscape' in Path(f).name])}")
print(f"  Total PNGs:      {len(files)}")
print(f"  Estimated cost:  ${total_cost_estimate:.2f}")
