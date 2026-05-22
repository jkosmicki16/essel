# Workshop Landing Page Template

A dark-themed, conversion-focused HubSpot CMS landing page template for in-person workshops and live events. Modeled after the high-ticket sales page aesthetic of Acquisition.com.

---

## File Structure

```
workshop-landing-page/
├── templates/
│   └── workshop-landing-page.html       Main page template
├── css/
│   └── workshop-landing-page.css        Global styles & design tokens
├── js/
│   └── workshop-landing-page.js         Minimal vanilla JS
└── modules/
    ├── announcement-banner.module/      Sticky top bar
    ├── hero-section.module/             Full-width hero
    ├── testimonials.module/             Video + testimonial image grid
    ├── feature-cards.module/            Numbered 3-column feature cards
    ├── stats-banner.module/             Full-bleed stats row
    └── faq-section.module/             Long-form Q&A section
```

---

## 1. Uploading to HubSpot Design Manager

### Option A — HubSpot CLI (Recommended)

1. Install the CLI: `npm install -g @hubspot/cli`
2. Authenticate: `hs auth`
3. From the project root, upload the entire folder:
   ```bash
   hs upload workshop-landing-page workshop-landing-page
   ```
4. Verify in **Design Manager → Files** that all files appear under `workshop-landing-page/`.

### Option B — Manual Upload (Design Manager UI)

1. In HubSpot, go to **Marketing → Files and Templates → Design Tools**.
2. Create the folder structure matching the file tree above.
3. For each file, click **New File**, select the file type, paste the contents, and save.
   - `.html` files → type: **Template**
   - `.css` files → type: **Stylesheet**
   - `.js` files → type: **JavaScript**
   - Module folders → create a **Module** in the matching path; each module contains its own `module.html`, `module.css`, and `meta.json`.

> **Module path tip:** When uploading via CLI, module folder names ending in `.module` are automatically recognized. Manually, use **New File → Module** inside the correct folder.

---

## 2. Creating a New Page from This Template

1. Go to **Marketing → Landing Pages** (or **Website → Website Pages**).
2. Click **Create** → **Landing Page**.
3. In the template picker, search for **"Workshop Landing Page"**.
4. Select it and click **Create page**.
5. The page opens in the drag-and-drop editor with all sections pre-populated with default content.

---

## 3. Modules & Editable Fields

| Module | Editable Fields |
|--------|-----------------|
| **Announcement Banner** | Show/hide toggle, background color, rich text message, CTA text + link |
| **Hero Section** | Eyebrow text, H1 headline, H2 subheadline, body copy, CTA text + link, CTA sub-text, background image, background color |
| **Testimonials** | Section heading, video embed code (iframe), repeating testimonial images + attribution |
| **Feature Cards** | Eyebrow, section heading, sub-text, repeating cards (number, title, description, image), CTA text + link + sub-text |
| **Stats Banner** | Eyebrow label, repeating stats (number + label), sub-text, optional background image |
| **FAQ Section** | Eyebrow, section heading, intro text, repeating Q&A pairs, industries callout (heading + list), CTA text + link + sub-text |

All text fields support inline editing directly in the page editor. Rich text fields open a full WYSIWYG editor. Image fields open the HubSpot media library.

---

## 4. Swapping the Color Palette

All colors are defined as CSS custom properties at the top of `css/workshop-landing-page.css`:

```css
:root {
  --wlp-bg-primary:       #0D0D0D;   /* Page background */
  --wlp-bg-card:          #1A1A1A;   /* Card / module backgrounds */
  --wlp-bg-elevated:      #222222;   /* Slightly lighter surfaces */
  --wlp-accent:           #F5A623;   /* Primary accent — CTAs, labels, highlights */
  --wlp-accent-dark:      #D4891A;   /* Accent hover darker shade */
  --wlp-accent-light:     #FFB84D;   /* Accent hover lighter shade */
  --wlp-text-primary:     #FFFFFF;   /* Headings */
  --wlp-text-secondary:   #B0B0B0;   /* Body copy */
  --wlp-text-muted:       #6B6B6B;   /* Captions, sub-text */
  --wlp-border:           #2A2A2A;   /* Dividers and card borders */
}
```

To rebrand:
- Change `--wlp-accent` to your brand color (used on all CTAs and labels).
- Change `--wlp-bg-primary` / `--wlp-bg-card` for a different dark tone, or flip to a light theme by setting them to near-white values and inverting text colors.

Individual modules also have a **Background Color** picker field (announcement banner) that overrides CSS defaults for that module instance.

---

## 5. Connecting CTA Buttons to a HubSpot Form or Meeting Link

### Link to a HubSpot Meeting Scheduler

1. In HubSpot, go to **Sales → Meetings** and copy the meeting link URL.
2. In the page editor, click any CTA button module field → edit the **CTA Link** field.
3. Paste the meeting link URL. Set **Open in new tab** to `true` if preferred.

### Embed a HubSpot Form (Inline)

To replace a CTA button with an embedded form, edit the module's `module.html` to swap the `<a>` tag for a HubL form module:

```html
{% form "cta_form" form_id="YOUR-FORM-GUID" %}
```

Or use a separate HubSpot Rich Text / Form module placed below the FAQ or Hero sections in the DnD area.

### Link to a Checkout / Ticketing Page

Set the CTA link to your external checkout URL (e.g. Eventbrite, Stripe Payment Link, or your own checkout page). The `open_in_new_tab` toggle is available on every CTA link field.

---

## 6. Typography

The template loads two Google Fonts:
- **Sora** — Headings (H1, H2, H3, card titles, stat numbers)
- **Plus Jakarta Sans** — Body copy, labels, nav, buttons

Both are loaded in the `<head>` of the main template. To change fonts, update the `<link>` tag in `templates/workshop-landing-page.html` and update the `--wlp-font-heading` and `--wlp-font-body` CSS variables.

---

## 7. Mobile Responsiveness

The template is fully responsive:
- Navigation collapses to a hamburger menu at 768px
- Feature cards stack to 2-column at 960px, 1-column at 600px
- Testimonial grid stacks to 1-column on mobile
- Hero text scales fluidly using `clamp()`
- Stats banner switches from horizontal to wrapped grid on mobile
- All touch targets are minimum 44×44px

---

## Requirements

- HubSpot CMS Hub (Starter, Professional, or Enterprise)
- HubSpot CLI v4+ for CLI upload method
- No external JS dependencies — vanilla JS only
