# LAPIDOLLIES — public brand portfolio

A single-page, static portfolio site for **Lapidollies**, the soft-luxury kawaii
collectible gemstone IP. Built to be opened by a licensing partner (POP MART and
others) from a plain public link — no login, no build step, no dependencies.

- **Live site:** https://nabiloobiloo.github.io/lapidollies/
- **Repository:** https://github.com/Nabiloobiloo/lapidollies (public)
- **Content:** Part I of the Lapidollies Brand Presentation — proposition, brand
  idea and promise, brand architecture, licensing rationale, Series 01 lineup,
  the eight character profiles, the character design system, brand design codes,
  the product ecosystem, the Super Rare Secret and the partnership opportunity.
- **Assets:** seven Series 01 character artworks and five brand-deck pages, taken
  from the supplied `LAPIDOLLIES_POPMART_SITE_PACKAGE` folder. Nothing on the site
  is invented: every headline, profile, trait and collector-card line comes from
  the brand presentation copy.

---

## Publish it (one setting, once)

The site is plain HTML/CSS/JS with relative paths, so it works from any static
host and from any sub-path. The public repository already exists and the site is
already pushed to `main`. All that is left is turning on GitHub Pages:

**Settings → Pages → Build and deployment**
→ Source: **Deploy from a branch** → Branch: **main** → Folder: **/ (root)** → **Save**

Wait ~1 minute, then open <https://nabiloobiloo.github.io/lapidollies/>.

> The repository must stay **public** for the Pages URL to be reachable without a
> GitHub login. Pages on a private repository is a paid feature and still asks
> reviewers to sign in.

### Private by link

The site is reachable by anyone holding the URL, but it is kept **out of search
engines** on purpose:

```html
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
```

`robots.txt` deliberately still says `Allow: /`. That looks backwards but is the
correct pairing: a crawler must be able to fetch the page to read the `noindex`
tag and drop it. A `Disallow: /` would block the fetch, and a blocked URL can
still be listed in search results — without content — if anyone links to it.
There is no `sitemap.xml` for the same reason: a sitemap invites indexing.

To make the site publicly searchable later, delete that one `<meta name="robots">`
line. Note that the **GitHub repository page** itself can still be indexed by
search engines — that is under GitHub's control, not this repository's. If the
brand needs to stay entirely out of search results, host the site on Netlify or
Cloudflare Pages from a *private* repository instead: the site stays public, the
source stops being visible.

### Verify it before sending the link

- Open the URL in a **private/incognito window** while logged out of GitHub.
- Check on a phone as well — the layout is responsive down to 320 px.
- Confirm the character artwork and the five deck pages load, and that the
  character cards open their profile panels.

### Alternative host

Any static host works. For Netlify Drop, drag this whole folder onto
<https://app.netlify.com/drop> — it returns a public HTTPS URL immediately.
If you use a custom domain later, update the two `og:url` / `canonical` URLs in
`index.html`.

---

## Redeploy after a change

```bash
git add -A
git commit -m "Update <what changed>"
git push
```

GitHub Pages rebuilds automatically within a minute. A hard refresh
(<kbd>Ctrl/Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) clears any cached CSS or image.

---

## Update the content

Everything lives in one file: **`index.html`**. Sections are marked with HTML
comments (`<!-- ============ CHARACTERS ============ -->`) in the same order as
the page.

### A character

Each Dollie is one `<button class="dollie">` block containing:

| Part | What it is |
|---|---|
| `style="--gem:… --gem-deep:… --gem-wash:…"` | her gemstone colour, a darker text-safe version, and a soft wash used behind the art |
| `--art-bg:#rrggbb` | only for artwork with a **painted** background, so the tile blends (Cloverine, Iolita, Rosalie) |
| `.dollie-gem` | the gemstone chip on the artwork |
| `.dollie-name` / `.dollie-role` / `.dollie-meta` / `.dollie-line` | the card front |
| `.dollie-detail` | the profile panel: `data-name`, `data-role`, `data-gem`, `data-img`, `data-alt`, `data-card`, `data-traits` (a JSON array of `["Label","Value"]` pairs) and the editorial paragraph inside |

Copy an existing block to add a Dollie, then add her to the Series 01 table and
to the hero tile strip.

### Artwork

Put new art through the helper so it matches the existing files:

```bash
pip install Pillow
python3 tools/optimize-art.py character ~/art/opal-dollie.png ophalie
python3 tools/optimize-art.py deck ~/deck/page-07.png product-packaging
```

It writes both sizes the site uses (`<slug>.webp` and `<slug>-sm.webp`) into
`assets/img/characters/` or `assets/img/deck/`.

Ophalie, the Super Rare Secret, deliberately ships **without** artwork — the card
and profile show a sealed prism panel instead. Drop in `ophalie.webp` and add
`data-img="assets/img/characters/ophalie.webp"` to her `.dollie-detail` when you
want to reveal her.

### Contact address

The address `nabiloukhai@gmail.com` appears in three places in `index.html`: the
hero button, the "Request Part II" button and the footer. Search and replace it
to change it.

---

## Structure

```
index.html                    the whole site — copy, layout, character data
assets/css/site.css           design system: ivory palette, gold accents, frames, components
assets/js/site.js             character profile panels, deck-page lightbox, nav, scroll reveals
assets/fonts/*.woff2          self-hosted Cormorant Garamond, Quicksand, Parisienne (SIL OFL)
assets/img/characters/*.webp  seven Series 01 character artworks, two sizes each
assets/img/deck/*.webp        five brand presentation pages, two sizes each
assets/img/og.jpg             link-preview image (1200×630)
assets/img/favicon.svg        gem favicon
tools/optimize-art.py         converts new source art into the site's WebP sizes
.nojekyll                     tells GitHub Pages to serve the files as-is
robots.txt                    allows crawling on purpose — see "Private by link" below
```

No framework, no bundler, no external requests at runtime — fonts and images are
served from this repository, so the page renders identically offline and behind a
corporate proxy. Total page weight is about 1.2 MB on first load.

## Credits and rights

Lapidollies character designs, names, artwork and brand copy belong to the brand
owner. The three typefaces are licensed under the SIL Open Font License 1.1
(see `assets/fonts/OFL.txt`).
