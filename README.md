# Broussard's Cooling & Heating, L.L.C.

Website for Broussard's Cooling & Heating, a family-owned A/C and heating company in Sorrento, Louisiana.

A static site: open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, Vercel). Keep the `img/` folder next to `index.html`.

## Service request form

At the bottom of `index.html`:

```js
const FORM_ENDPOINT = "";
```

Paste a Formspree or Web3Forms endpoint that delivers to broussardscooling@gmail.com. While it is empty, the form runs in demo mode: it shows the confirmation screen but sends nothing.
