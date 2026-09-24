# Mobile review — September 24, 2026

Reviewed all 11 static pages: homepage, shop, Blue Raspberry, Mint, Mango, formula, movement, FAQ, affiliate, wholesale, and Urus giveaway.

## Changes

- Added a dedicated responsive stylesheet while preserving the desktop styles and brand assets.
- Wrapped the promotion strip, kept the pinned phone header around 60px tall, and made header/menu controls at least 44px tall. Header offsets adapt to their rendered height and safe areas.
- Fixed the menu breakpoint mismatch, background scrolling on iOS, keyboard containment, Escape dismissal, and scroll/focus restoration.
- Adjusted phone typography, spacing, product artwork, wholesale artwork, entry cards, review notes, footer links, and anchor clearance.
- Displayed the entire Urus photograph above its campaign copy on phones, including landscape phones.
- Used one feed column on phones, larger playback controls, and caption labels below artwork. Caption dialogs keep their close control reachable, scroll their text, restore focus and scroll position, and respect reduced motion.
- Removed the shared-script error on affiliate, wholesale, and giveaway pages, which do not contain a social-post dialog.
- Added whitespace after paragraph line breaks so sentences remain separated when mobile styles remove those breaks.

## Verification

Browser automation used Chromium and WebKit with iPhone emulation, not a physical iPhone. All pages were inspected visually and scanned for page overflow, content outside the viewport, broken images, undersized controls, and uncaught script errors.

- Phone widths: 320, 375, 390, and 430 CSS pixels. Additional widths: 600, 768, 844, 1024, and 1440.
- Landscape interaction checks at 844 × 390 and small-screen checks at 320 × 568.
- 357 interaction assertions passed in each browser: all-page menus, navigation, breakpoint transitions, every caption, close controls, scrolling/focus restoration, reel play/pause/mute, reduced motion, offscreen playback, FAQs, and product purchase anchors.
- Checked all pages with default, 125%, and 200% base text sizing, including landscape layout.
- No page-level horizontal scrolling, clipped text, broken images, or script errors in the final phone checks. Visible links and buttons meet a 44px minimum height on phone/tablet layouts.
- Compared all 11 desktop pages at 1440px with the baseline. Original desktop composition and styling are preserved.
- Verified 281 internal links/assets/anchors resolve. Existing review-note markup and destination links match the baseline exactly.
- JavaScript syntax and `git diff --check` pass. There is no package build or backend in this static repository.

The WebKit test runner logged missing icons for its own native AirPlay/Picture-in-Picture controls. These were browser-internal messages; the page script and playback assertions passed.

## Existing external forms

This repository contains no signup form or submission backend. Existing application, checkout, and giveaway links remain unchanged. The linked affiliate, wholesale, and giveaway forms loaded at 390px without page-level horizontal scrolling. No application, entry, account, or purchase was submitted.

- The affiliate portal has approximately 40px fields, 14px input text, and a 36px submit button. These need an upstream portal style update for 44px controls and 16px input text.
- Wholesale fields are 48px tall with 16px input text; file uploads and the submit control are reachable.
- Giveaway fields are 53px tall, but their 15px input text may trigger iPhone focus zoom. A 16px input font would need to be set on the external giveaway site.

All existing pricing, affiliate terms, wholesale details, giveaway details, draft captions, and business-review notes remain as supplied. No missing business information was filled in.

## Repeat the checks

Serve `dist` locally with `python3 -m http.server 4173 --directory dist`. At each phone size, visit every page, scroll from top to footer, open the menu, reach its final link, close it, and verify the page returns to its prior position. Open all captions, scroll their text, close by button and Escape, and exercise reel controls. Expand FAQs and follow flavor/purchase anchors. Repeat the menu and dialog checks in landscape, then compare the desktop layout at 1440px.
