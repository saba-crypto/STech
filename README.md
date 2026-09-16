# STech

STech uses a modified version of the **SCSS 7–1 pattern**. The project keeps the familiar separation of concerns from the 7–1 architecture, but page-specific styles are compiled into separate CSS files instead of being included in one global stylesheet.

## SCSS structure

```text
styles/
├── abstracts/
│   ├── _index.scss
│   ├── _mixins.scss
│   └── _variables.scss
├── base/
│   ├── _general.scss
│   ├── _reset.scss
│   └── _typography.scss
├── components/
│   ├── _articles.scss
│   ├── _buttons.scss
│   └── _product-cards.scss
├── layout/
│   ├── _footer.scss
│   ├── _header.scss
│   └── _sidebar.scss
├── pages/
│   └── home/
│       ├── _section1.scss
│       ├── _section2.scss
│       ├── _section3.scss
│       ├── _section4.scss
│       ├── _section5.scss
│       ├── home.scss
│       └── home.css
├── main.scss
└── main.css
```

### `abstracts/`

Contains reusable Sass helpers and design values, such as variables and mixins. These files do not generate CSS on their own. They are made available to other files through the abstracts index:

```scss
@use "abstracts" as *;
```

### `base/`

Contains project-wide foundational styles:

- `_reset.scss` removes or normalizes browser defaults.
- `_general.scss` contains general global rules.
- `_typography.scss` defines global typography styles.

### `components/`

Contains reusable UI elements, such as buttons, articles, and product cards. A component belongs here when it can be used on more than one page or in more than one section.

### `layout/`

Contains styles for shared structural areas of the site, including the header, footer, and sidebar.

### `pages/`

Contains styles that are specific to one page. Each page gets its own folder and its own SCSS entry point. Page sections are kept as partials and imported by that page's entry file.

For example, the home page entry point is:

```scss
@use "../../abstracts" as *;
@use "./section1";
@use "./section2";
@use "./section3";
@use "./section4";
@use "./section5";
```

The section partials are compiled together into `styles/pages/home/home.css`.

### Global and page-specific styles

In a standard SCSS 7–1 setup, all categories—including page styles—are commonly imported into one entry point and compiled into one `main.css` file. This project intentionally uses a different approach:

- `main.scss` compiles to `main.css` and contains styles shared across the application.
- Global styles include the reset, base styles, shared components, and shared layouts.
- Each page entry point compiles to its own CSS file inside that page's folder.
- Page-specific styles must not be imported into `main.scss`.

This keeps page bundles smaller. A page only loads the styles it needs, so the home page does not have to load checkout, cart, or other page-specific styles.

### Entry points

The project has one global entry point and one entry point for each page bundle:

| SCSS entry point              | Compiled CSS                 | Purpose                 |
| ----------------------------- | ---------------------------- | ----------------------- |
| `styles/main.scss`            | `styles/main.css`            | Shared site-wide styles |
| `styles/pages/home/home.scss` | `styles/pages/home/home.css` | Home page styles        |

Every HTML page should load the global stylesheet and only its own page stylesheet:

```html
<link rel="stylesheet" href="./styles/main.css" />
<link rel="stylesheet" href="./styles/pages/home/home.css" />
```

For a cart page, use `cart.css` instead of `home.css`; for a checkout page, use `checkout.css`. This preserves the shared visual foundation while avoiding unnecessary page-specific CSS.

### Guidelines

1. Put reusable values and helpers in `abstracts/`.
2. Put global foundations in `base/`.
3. Put reusable UI elements in `components/`.
4. Put shared structural regions in `layout/`.
5. Put page-only styles in `pages/<page-name>/`.
6. Use partials, prefixed with `_`, for files that are imported into an entry point.
7. Keep each page's imports in that page's entry file.
8. Do not place page-specific imports in `main.scss`.
9. If a style becomes shared by multiple pages, move it to the appropriate global layer and include it through `main.scss`.
