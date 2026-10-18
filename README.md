# cyclopsevision

Website for Cyclopse Vision: depth-from-defocus cameras + SDK, and video interpretability.

Plain static HTML/CSS/JS, no build step.

## Run locally

```sh
python -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

Repo **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` and `/ (root)`.
The site will be at https://sleekeagle.github.io/cyclopsevision/.

## Structure

- `index.html`: landing page (both product lines, defocus demo, research, contact)
- `depth.html`: depth camera and SDK
- `interpretability.html`: video interpretability
- `assets/css/styles.css`, `assets/js/main.js`, `assets/img/logo.svg`

## To fill in

Search for `TODO` in the HTML: publications, contact email, camera specs.
