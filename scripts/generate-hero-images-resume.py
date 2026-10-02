#!/usr/bin/env python3
"""
RESUME script — generates only the 9 missing hero images.
Run after topping up fal.ai balance at fal.ai/dashboard/billing.

Usage:
  FAL_KEY="..." python3 scripts/generate-hero-images-resume.py
  (key is in .env.local)
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

# Only the 9 missing images
MISSING = [
    {
        "slug": "sin-4-tool-misuse",
        "label": "Sin 4: Tool Misuse",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "expected": (1920, 1080),
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
        "orientation": "portrait",
        "aspect_ratio": "9:16",
        "expected": (1080, 1920),
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
        "slug": "sin-5-loop-hell",
        "label": "Sin 5: Loop Hell",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "expected": (1920, 1080),
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
        "orientation": "portrait",
        "aspect_ratio": "9:16",
        "expected": (1080, 1920),
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
        "slug": "sin-6-specification-gaming",
        "label": "Sin 6: Specification Gaming",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "expected": (1920, 1080),
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
        "orientation": "portrait",
        "aspect_ratio": "9:16",
        "expected": (1080, 1920),
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
        "slug": "sin-7-reward-hacking",
        "label": "Sin 7: Reward Hacking",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "expected": (1920, 1080),
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
        "orientation": "portrait",
        "aspect_ratio": "9:16",
        "expected": (1080, 1920),
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
    {
        "slug": "sin-8-misevolution",
        "label": "Sin 8: Misevolution",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "expected": (1920, 1080),
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

def download_image(url, dest):
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

def resize_to_exact(path, target_w, target_h):
    import subprocess
    cmd = ["convert", str(path), "-resize", f"{target_w}x{target_h}^",
           "-gravity", "Center", "-extent", f"{target_w}x{target_h}", str(path)]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0

def verify_dimensions(path):
    from PIL import Image
    with Image.open(path) as img:
        return img.size

print("=" * 70)
print("RESUME: generating 9 missing hero images")
print("=" * 70)

total_cost = 0.0
COST_PER = 0.06

for item in MISSING:
    filename = f"{item['slug']}-{item['orientation']}.png"
    output_path = OUTPUT_DIR / filename
    expected = item["expected"]

    # Skip if already exists and correct
    if output_path.exists():
        actual = verify_dimensions(output_path)
        if actual == expected:
            print(f"SKIP (exists): {filename} {actual[0]}x{actual[1]}")
            continue

    print(f"\n[{item['label']} / {item['orientation']}]")
    print(f"  -> {filename}")

    try:
        result = fal_client.run(
            "fal-ai/flux-pro/v1.1-ultra",
            arguments={
                "prompt": item["concept"],
                "negative_prompt": NEGATIVE_PROMPT,
                "aspect_ratio": item["aspect_ratio"],
                "num_images": 1,
                "safety_tolerance": "2",
                "output_format": "png",
            }
        )

        images = result.get("images", [])
        if not images:
            print(f"  ERROR: no images returned")
            continue

        url = images[0]["url"]
        seed = result.get("seed", "N/A")
        print(f"  Seed: {seed}")

        if not download_image(url, output_path):
            print(f"  ERROR: download failed")
            continue

        actual = verify_dimensions(output_path)
        print(f"  Dims: {actual[0]}x{actual[1]} (expected {expected[0]}x{expected[1]})")

        if actual != expected:
            resize_to_exact(output_path, expected[0], expected[1])
            actual = verify_dimensions(output_path)
            print(f"  After resize: {actual[0]}x{actual[1]}")

        total_cost += COST_PER
        print(f"  OK: {filename}")

    except Exception as e:
        print(f"  FAILED: {e}")

    time.sleep(1)

print("\n" + "=" * 70)
print(f"DONE. Estimated cost this run: ${total_cost:.2f}")

# Final verification
print("\nFINAL VERIFICATION:")
from PIL import Image
import glob
files = sorted(glob.glob(str(OUTPUT_DIR / "*.png")))
for fpath in files:
    try:
        with Image.open(fpath) as img:
            w, h = img.size
            p = Path(fpath)
            ok = ""
            if "portrait" in p.name and (w, h) != (1080, 1920):
                ok = f"WRONG (expected 1080x1920)"
            elif "landscape" in p.name and (w, h) != (1920, 1080):
                ok = f"WRONG (expected 1920x1080)"
            else:
                ok = "OK"
            print(f"  {p.name}: {w}x{h} {ok}")
    except Exception as e:
        print(f"  {Path(fpath).name}: ERROR — {e}")

portraits = len([f for f in files if "portrait" in Path(f).name])
landscapes = len([f for f in files if "landscape" in Path(f).name])
print(f"\nPortrait: {portraits}/9  Landscape: {landscapes}/9  Total: {len(files)}/18")
