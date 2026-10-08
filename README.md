# Broussard's Cooling & Heating, L.L.C.

Website for Broussard's Cooling & Heating, a family-owned A/C and heating company in Sorrento, Louisiana.

A static site with no build step. Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, Vercel).

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `services.html` | Services, commercial, maintenance plan, troubleshooting, FAQ |
| `about.html` | Company history and reviews |
| `contact.html` | Service request form and service area map |

All pages share `styles.css`, `site.js` and the `img/` folder.

Links can preselect the service on the request form, e.g. `contact.html?service=Commercial`.

## Service request form

At the top of `site.js`:

```js
const FORM_ENDPOINT = "";
```

Paste a Formspree or Web3Forms endpoint that delivers to broussardscooling@gmail.com. While it is empty, the form only shows the thank-you message and sends nothing.
