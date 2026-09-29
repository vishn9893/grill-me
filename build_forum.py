#!/usr/bin/env python3
import os
from pathlib import Path
import html
import shutil

BASE_DIR = Path(__file__).parent
POSTS_DIR = BASE_DIR / "posts"
STATIC_DIR = BASE_DIR / "static"
OUTPUT_DIR = BASE_DIR / "output"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

posts = []
for md_path in sorted(POSTS_DIR.glob("*.md")):
    with open(md_path, "r", encoding="utf-8") as f:
        text = f.read()
    # first line is title
    title_line = text.splitlines()[0]
    title = title_line.lstrip('# ').strip()
    body_html = f"<pre>{html.escape(text)}</pre>"
    out_name = f"post-{md_path.stem}.html"
    out_path = OUTPUT_DIR / out_name
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<title>{html.escape(title)}</title>\n<link rel=\"stylesheet\" href=\"../static/style.css\">\n</head>\n<body>\n<h1>{html.escape(title)}</h1>\n{body_html}\n<p><a href=\"../index.html\">Back to forum</a></p>\n</body>\n</html>")
    posts.append({"title": title, "link": out_name})

# Index page
with open(OUTPUT_DIR / "index.html", "w", encoding="utf-8") as f:
    f.write("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Hacker News Clone</title>\n<link rel=\"stylesheet\" href=\"static/style.css\">\n</head>\n<body>\n<h1>Hacker News Clone</h1>\n<ul>\n")
    for post in posts:
        f.write(f"  <li><a href=\"{post['link']}\">{post['title']}</a></li>\n")
    f.write("</ul>\n</body>\n</html>")

# Copy static files
shutil.copytree(STATIC_DIR, OUTPUT_DIR / "static", dirs_exist_ok=True)

print(f"Built forum with {len(posts)} posts in {OUTPUT_DIR}")
