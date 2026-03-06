"""
Extract old property URLs and legacy IDs from WordPress WXR XML export.

Parses the XML to find all published rem_property items and extracts:
- The URL path from <link>
- The post_id (or post_parent if non-zero) as the legacy_id

Outputs: lib/data/old-urls.json
"""

import xml.etree.ElementTree as ET
import json
import os
from urllib.parse import urlparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
XML_PATH = os.path.join(PROJECT_DIR, "lib", "data", "old-properties.xml")
OUTPUT_PATH = os.path.join(PROJECT_DIR, "lib", "data", "old-urls.json")

# WordPress XML namespaces
NS = {
    "wp": "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
}


def extract_old_urls():
    print(f"Parsing XML: {XML_PATH}")
    tree = ET.parse(XML_PATH)
    root = tree.getroot()

    results = []
    skipped = 0

    # Find all <item> elements in the channel
    for item in root.iter("item"):
        # Check post_type
        post_type_el = item.find("wp:post_type", NS)
        if post_type_el is None or post_type_el.text != "rem_property":
            continue

        # Check status - only published properties
        status_el = item.find("wp:status", NS)
        if status_el is None or status_el.text != "publish":
            skipped += 1
            continue

        # Get the link (old URL)
        link_el = item.find("link")
        if link_el is None or not link_el.text:
            skipped += 1
            continue

        # Get post_id
        post_id_el = item.find("wp:post_id", NS)
        if post_id_el is None or not post_id_el.text:
            skipped += 1
            continue

        post_id = int(post_id_el.text)

        # Get post_parent - use it instead of post_id if non-zero
        post_parent_el = item.find("wp:post_parent", NS)
        post_parent = int(post_parent_el.text) if post_parent_el is not None and post_parent_el.text else 0

        legacy_id = post_parent if post_parent != 0 else post_id

        # Extract just the path from the full URL
        parsed = urlparse(link_el.text)
        old_path = parsed.path  # e.g. /property/stilno-dvustajno-zhilisthe-v-tih-i-spokoe/

        results.append({
            "legacy_id": legacy_id,
            "old_path": old_path,
            "title": item.find("title").text if item.find("title") is not None else "",
        })

    # Write output
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Extracted {len(results)} published properties (skipped {skipped})")
    print(f"Output written to: {OUTPUT_PATH}")

    # Show a few samples
    for entry in results[:3]:
        print(f"  legacy_id={entry['legacy_id']}  path={entry['old_path']}")


if __name__ == "__main__":
    extract_old_urls()
