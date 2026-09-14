# Next-session issues

Reported on 2026-09-15. These are observed local behaviours, not yet diagnosed
or fixed.

## 1. Admin session is not retained while navigating

- Reproduction: sign in to `/admin`, navigate to another tab/page, then return
  to the admin screen.
- Observed: the admin login screen appears again.
- Expected: the authenticated session should remain valid for its configured
  lifetime and survive ordinary in-browser navigation.
- Investigation: inspect Better Auth cookie attributes, session expiry and
  local origin/host consistency before changing authentication behaviour.

## 2. Rich-text editor interaction is confusing

- Reproduction: click or right-click inside existing post text in the editor.
- Observed: content or editor state appears to change unexpectedly.
- Expected: editing should behave predictably; right-click should not mutate
  the document and controls should make the active formatting state clear.
- Investigation: reproduce with a saved post, verify Tiptap selection/focus
  behaviour and add active/disabled toolbar affordances as needed.

## 3. Category creation fails

- Reproduction: enter a category and select “Kategori kaydet”.
- Observed: “Kategori kaydedilemedi. Başlığın benzersiz olduğundan emin ol.”
- Expected: a new, valid category should be created; a duplicate should receive
  an accurate, specific message.
- Investigation: inspect the API response, client payload and PostgreSQL unique
  constraints. Do not assume the title is actually a duplicate.

## 4. Published cover image is missing

- Reproduction: upload/select a cover image, publish the post, open its public
  page.
- Observed: the cover image does not display.
- Expected: a successfully uploaded image is served through `/api/media/...`
  and appears on both the post card and post page.
- Investigation: compare saved object key, MinIO object existence, media route
  response headers/status and Next Image rendering.

## 5. File selection control needs design work

- Observed: the cover-image “Dosya seç” control looks like unstyled native HTML.
- Expected: it should match the visual system while remaining keyboard and
  screen-reader accessible.
- Planned fix: retain the native input for accessibility, visually hide it, and
  expose a styled label/button plus selected-file state.
