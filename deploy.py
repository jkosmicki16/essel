#!/usr/bin/env python3
"""
Deploy (or redeploy) the Workshop Landing Page template + page to HubSpot.

Usage:
    export HS_TOKEN="pat-na2-..."
    python3 deploy.py

The script uploads the template to Design Manager and creates a DRAFT
landing page. Re-running it will create a new page (existing pages are
not overwritten — manage them in the HubSpot editor).
"""
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

TOKEN = os.environ.get("HS_TOKEN", "")
if not TOKEN:
    sys.exit("Error: HS_TOKEN environment variable not set.\n"
             "  export HS_TOKEN='pat-na2-...'")

BASE = "https://api.hubapi.com"
ROOT = Path(__file__).parent / "workshop-landing-page"


def hs(method, endpoint, body=None):
    url = f"{BASE}{endpoint}"
    data = json.dumps(body).encode() if body else None
    headers = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read())
        except Exception:
            return e.code, {"raw": e.read().decode()}


def main():
    css = (ROOT / "css" / "workshop-landing-page.css").read_text()
    js  = (ROOT / "js"  / "workshop-landing-page.js").read_text()
    tpl = (ROOT / "templates" / "workshop-landing-page.html").read_text()

    # Inline CSS and JS into the template (replace require_css/require_js placeholders)
    # For a full DnD deploy use `hs upload` via the CLI instead.
    source = tpl.replace(
        "{{ require_css(get_asset_url('../css/workshop-landing-page.css')) }}",
        f"<style>\n{css}\n</style>",
    ).replace(
        "{{ require_js(get_asset_url('../js/workshop-landing-page.js'), { \"position\": \"footer\" }) }}",
        f"<script>\n{js}\n</script>",
    )

    print(f"Template size: {len(source):,} chars")

    # 1. Upload template
    print("\n── Uploading template…")
    s, r = hs("POST", "/content/api/v2/templates", {
        "source": source,
        "label":  "Workshop Landing Page",
        "path":   "workshop-landing-page/templates/workshop-landing-page",
        "type":   "page",
        "is_available_for_new_content": True,
    })
    if s not in (200, 201):
        sys.exit(f"Template upload failed ({s}):\n{json.dumps(r, indent=2)}")

    tmpl_path = r["path"]
    print(f"Template path: {tmpl_path}  (id={r['id']})")

    # 2. Create landing page
    print("\n── Creating landing page…")
    s2, p = hs("POST", "/cms/v3/pages/landing-pages", {
        "name":            "Workshop Landing Page",
        "slug":            "workshop-landing-page",
        "htmlTitle":       "Workshop Landing Page | Live In-Person Marketing Event",
        "metaDescription": "Join us for an intensive 2-day in-person marketing workshop.",
        "templatePath":    tmpl_path,
        "state":           "DRAFT",
    })
    if s2 not in (200, 201):
        sys.exit(f"Page creation failed ({s2}):\n{json.dumps(p, indent=2)}")

    portal = 398176
    pid    = p["id"]
    url    = p.get("url") or p.get("fullUrl") or ""
    print(f"\nPage created ✓")
    print(f"  Live URL:      {url}")
    print(f"  HubSpot editor: https://app-na2.hubspot.com/pages/{portal}/editor/{pid}")


if __name__ == "__main__":
    main()
