import os
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse, quote

import requests
from bs4 import BeautifulSoup

# ======= CẤU HÌNH =======
BASE_URL = "https://the-olympus-online.web.app"  # đổi nếu cần
ROUTES_TXT = "routes.txt"
OUT_DIR = Path("viewsource_full")
TIMEOUT = 30
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari"
)
STRIP_QUERY = True  # True: bỏ query (?v=...) khi lưu tên file

# ======= TIỆN ÍCH =======
def is_data_or_js(url: str) -> bool:
    u = url.strip().lower()
    return u.startswith("data:") or u.startswith("javascript:")

def same_origin(base: str, cand: str) -> bool:
    b, c = urlparse(base), urlparse(cand)
    if not c.scheme and not c.netloc:
        return True  # relative
    return (b.scheme, b.netloc) == (c.scheme, c.netloc)

def normalize_url(page_url: str, href: str, base_href: str | None) -> str | None:
    if not href or is_data_or_js(href):
        return None
    base_for_join = base_href if base_href else page_url
    return urljoin(base_for_join, href)

def strip_query_if_needed(u: str) -> str:
    if not STRIP_QUERY:
        return u
    p = urlparse(u)
    return urlunparse((p.scheme, p.netloc, p.path, p.params, "", p.fragment))

def path_from_url(u: str, force_ext: str | None = None) -> Path:
    p = urlparse(u)
    path = p.path
    if path.endswith("/") or path == "":
        path = path + "index.html" if force_ext in (".html", None) else path + f"index{force_ext}"
    if force_ext and not Path(path).suffix:
        path = path + force_ext
    return OUT_DIR / path.lstrip("/")

def ensure_parent(fp: Path):
    fp.parent.mkdir(parents=True, exist_ok=True)

def fetch_resp(url: str) -> requests.Response:
    r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT)
    r.raise_for_status()
    return r

def save_file(fp: Path, data: bytes):
    ensure_parent(fp)
    fp.write_bytes(data)

def load_routes(txt: str):
    p = Path(txt)
    if not p.exists():
        print(f"Không thấy {txt}. Tạo file và thêm mỗi dòng một route.")
        return []
    out, seen = [], set()
    for line in p.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if s not in seen:
            seen.add(s)
            out.append(s)
    return out

def build_url(route: str) -> str:
    route = route.strip()
    if route.startswith("http://") or route.startswith("https://"):
        return route
    if route.startswith("#"):
        return BASE_URL.rstrip("/") + route
    return urljoin(BASE_URL.rstrip("/") + "/", route.lstrip("/"))

# ======= XỬ LÝ ESCAPE & ENCODE CHO CSS URL =======
def css_unescape(u: str) -> str:
    # gỡ các escape phổ biến của CSS (đủ dùng cho case font có khoảng trắng)
    return (
        u.replace(r"\ ", " ")
        .replace(r"\(", "(")
        .replace(r"\)", ")")
        .replace(r"\/", "/")
        .replace(r"\#", "#")
    )

def encode_url_path(u: str) -> str:
    p = urlparse(u)
    new_path = quote(p.path, safe="/%")  # encode khoảng trắng thành %20, giữ '/','%'
    return urlunparse((p.scheme, p.netloc, new_path, p.params, p.query, p.fragment))

# ======= PHÂN TÍCH CSS =======
CSS_URL_RE = re.compile(r"url\(\s*([\"']?)(?P<u>[^)\"']+)\1\s*\)", re.IGNORECASE)
CSS_IMPORT_RE = re.compile(r"@import\s+(?:url\()?(\"'?)(?P<u>[^)\"';]+)\1\)?", re.IGNORECASE)

def extract_css_links(css_text: str):
    urls = [m.group("u").strip() for m in CSS_URL_RE.finditer(css_text)]
    urls += [m.group("u").strip() for m in CSS_IMPORT_RE.finditer(css_text)]
    out, seen = [], set()
    for u in urls:
        if not is_data_or_js(u) and u not in seen:
            seen.add(u)
            out.append(u)
    return out

# ======= PHÂN TÍCH HTML =======
def extract_html_assets(html_bytes: bytes, page_url: str):
    soup = BeautifulSoup(html_bytes, "html.parser")
    base_tag = soup.find("base", href=True)
    base_href = base_tag["href"].strip() if base_tag else None

    assets = []

    # script src
    for s in soup.find_all("script", src=True):
        assets.append(s["src"])

    # link href (stylesheet, icon, manifest, preload, ...)
    for l in soup.find_all("link", href=True):
        assets.append(l["href"])

    # img src
    for im in soup.find_all("img", src=True):
        assets.append(im["src"])

    # srcset (img/picture/source)
    def parse_srcset(v: str):
        items = []
        for part in v.split(","):
            u = part.strip().split()[0]
            if u:
                items.append(u)
        return items

    for el in soup.find_all(srcset=True):
        assets.extend(parse_srcset(el.get("srcset", "")))

    # video/audio/source
    for s in soup.find_all("source", src=True):
        assets.append(s["src"])

    # object/embed
    for s in soup.find_all(["object", "embed"]):
        for attr in ("data", "src"):
            if s.has_attr(attr):
                assets.append(s[attr])

    # background= on HTML
    for el in soup.find_all(background=True):
        assets.append(el["background"])

    # (NEW) inline <style> ... @import/url(...)
    inline_css_urls = []
    for st in soup.find_all("style"):
        css_text = st.string or st.get_text() or ""
        if css_text.strip():
            inline_css_urls.extend(extract_css_links(css_text))

    # (NEW) style="..." attribute url(...)
    for el in soup.select("*[style]"):
        css_text = el.get("style", "")
        inline_css_urls.extend(extract_css_links(css_text))

    assets.extend(inline_css_urls)

    # Resolve + lọc same-origin
    norm, seen = [], set()
    for href in assets:
        # gỡ escape kiểu CSS nếu có (ví dụ FZ\ Poppins.ttf)
        href = css_unescape(href)
        absu = normalize_url(page_url, href, base_href)
        if not absu:
            continue
        absu = strip_query_if_needed(absu)
        absu = encode_url_path(absu)  # encode path tránh lỗi khoảng trắng
        if same_origin(page_url, absu) and absu not in seen:
            seen.add(absu)
            norm.append(absu)

    return norm

# ======= QUY TRÌNH CHÍNH =======
def fetch_page_and_relatives(page_url: str):
    # 1) HTML gốc
    try:
        r_html = fetch_resp(page_url)
        html_bytes = r_html.content
    except requests.HTTPError as e:
        code = e.response.status_code if e.response is not None else "?"
        print(f"[HTML-ERR] {page_url} -> HTTP {code}")
        return
    except Exception as e:
        print(f"[HTML-ERR] {page_url} -> {e}")
        return

    html_fp = path_from_url(page_url, force_ext=".html")
    save_file(html_fp, html_bytes)
    print(f"[HTML] {page_url} -> {html_fp}")

    # 2) Mọi asset relative/cùng origin trong HTML (kể cả inline CSS/style)
    assets = extract_html_assets(html_bytes, page_url)

    # 3) Tải asset
    downloaded_css = []
    for a in assets:
        try:
            resp = fetch_resp(a)
            data = resp.content
            ct = (resp.headers.get("Content-Type") or "").lower()
            suf = Path(urlparse(a).path).suffix.lower()

            # Nếu thiếu đuôi mà biết content-type, gán hợp lý
            force_ext = None
            if not suf:
                if "text/css" in ct:
                    force_ext = ".css"
                elif "javascript" in ct or ct.endswith("/js"):
                    force_ext = ".js"
                elif "image/" in ct:
                    if "png" in ct:
                        force_ext = ".png"
                    elif "jpeg" in ct or "jpg" in ct:
                        force_ext = ".jpg"
                    elif "svg" in ct:
                        force_ext = ".svg"
                    elif "gif" in ct:
                        force_ext = ".gif"
                elif "font/" in ct:
                    if "woff2" in ct:
                        force_ext = ".woff2"
                    elif "woff" in ct:
                        force_ext = ".woff"
                    elif "ttf" in ct:
                        force_ext = ".ttf"

            fp = path_from_url(a, force_ext=force_ext)
            save_file(fp, data)
            print(f"  [ASSET] {a} -> {fp}")

            # nếu là CSS, đưa vào hàng quét tiếp
            if fp.suffix.lower() == ".css" or "text/css" in ct:
                downloaded_css.append((a, data))

        except requests.HTTPError as e:
            code = e.response.status_code if e.response is not None else "?"
            print(f"  [ASSET-ERR] {a} -> HTTP {code}")
        except Exception as e:
            print(f"  [ASSET-ERR] {a} -> {e}")

    # 4) Quét CSS: @import và url(...)
    for css_url, css_bytes in downloaded_css:
        try:
            css_text = css_bytes.decode("utf-8", errors="ignore")
            inner_urls = extract_css_links(css_text)
            for relu in inner_urls:
                relu = css_unescape(relu)  # gỡ escape \
                absu = urljoin(css_url, relu)
                absu = strip_query_if_needed(absu)
                absu = encode_url_path(absu)  # encode path
                if not same_origin(css_url, absu) or is_data_or_js(absu):
                    continue
                try:
                    r_dep = fetch_resp(absu)
                    data = r_dep.content
                    dep_ct = (r_dep.headers.get("Content-Type") or "").lower()
                    dep_suf = Path(urlparse(absu).path).suffix.lower()

                    force_ext = None
                    if not dep_suf:
                        if "font/" in dep_ct:
                            if "woff2" in dep_ct:
                                force_ext = ".woff2"
                            elif "woff" in dep_ct:
                                force_ext = ".woff"
                            elif "ttf" in dep_ct:
                                force_ext = ".ttf"
                        elif "image/" in dep_ct:
                            if "png" in dep_ct:
                                force_ext = ".png"
                            elif "jpeg" in dep_ct or "jpg" in dep_ct:
                                force_ext = ".jpg"
                            elif "svg" in dep_ct:
                                force_ext = ".svg"
                            elif "gif" in dep_ct:
                                force_ext = ".gif"

                    fp_dep = path_from_url(absu, force_ext=force_ext)
                    save_file(fp_dep, data)
                    print(f"    [CSS-RES] {absu} -> {fp_dep}")
                except requests.HTTPError as e:
                    code = e.response.status_code if e.response is not None else "?"
                    print(f"    [CSS-RES-ERR] {absu} -> HTTP {code}")
                except Exception as e:
                    print(f"    [CSS-RES-ERR] {absu} -> {e}")
        except Exception as e:
            print(f"  [CSS-PARSE-ERR] {css_url} -> {e}")

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    routes = load_routes(ROUTES_TXT)
    if not routes:
        return
    for r in routes:
        url = build_url(r)
        print(f"==> FETCH {url}")
        fetch_page_and_relatives(url)

if __name__ == "__main__":
    main()
