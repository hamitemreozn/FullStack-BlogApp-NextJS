# Next-session issues

Reported on 2026-09-15 and investigated on 2026-09-15.

## 1. Admin session is not retained while navigating

- Reproduction: sign in to `/admin`, navigate to another tab/page, then return
  to the admin screen.
- Observed: the admin login screen appears again.
- Expected: the authenticated session should remain valid for its configured
  lifetime and survive ordinary in-browser navigation.
- Diagnosis: the sessions themselves are valid for seven days. Better Auth's
  default cookie prefix is shared by all applications on `localhost` (ports do
  not isolate cookies), so another local project can overwrite this session.
- Fix: use the project-specific `astrology-blog` cookie prefix. In development,
  explicitly support both `localhost:3000` and `127.0.0.1:3000` as separate,
  trusted local hosts. One fresh login is required after this cookie rename.

## 2. Rich-text editor interaction is confusing

- Reproduction: click or right-click inside existing post text in the editor.
- Observed: content or editor state appears to change unexpectedly.
- Expected: editing should behave predictably; right-click should not mutate
  the document and controls should make the active formatting state clear.
- Diagnosis: resetting the form to “new post” did not remount the editor, so
  stale editor state could remain visible.
- Fix: remount the editor on every post/new-post selection; show active toolbar
  states and describe the expected right-click behaviour. A logged-in manual
  interaction check remains part of the retest.

## 3. Category creation fails

- Reproduction: enter a category and select “Kategori kaydet”.
- Observed: “Kategori kaydedilemedi. Başlığın benzersiz olduğundan emin ol.”
- Expected: a new, valid category should be created; a duplicate should receive
  an accurate, specific message.
- Diagnosis: category creation succeeded in PostgreSQL, but the client tried
  to call `reset()` on a no-longer-current React event target and then displayed
  a false failure message.
- Fix: keep a stable form reference, reset it after the successful response,
  and surface the API's actual safe error message when a request truly fails.

## 4. Published cover image is missing

- Reproduction: upload/select a cover image, publish the post, open its public
  page.
- Observed: the cover image does not display.
- Expected: a successfully uploaded image is served through `/api/media/...`
  and appears on both the post card and post page.
- Diagnosis: the uploaded image is present in MinIO, but no published post in
  PostgreSQL references its object key. The missing image is therefore a failed
  post-save/linkage outcome, not a MinIO delivery failure.
- Follow-up diagnosis: after a post was successfully published, its key and
  MinIO object were both correct. The actual rendering failure came from
  Next.js image optimization rejecting the private-media route's signed
  redirect as an invalid internal image response.
- Fix: show the post API's actual safe error message instead of a generic one,
  add a selected-image preview before saving, and serve private media through
  the browser directly (`unoptimized`) so it can follow the short-lived signed
  redirect. The post page was visually verified and the media request returned
  `200 image/jpeg`.

## 5. File selection control needs design work

- Observed: the cover-image “Dosya seç” control looks like unstyled native HTML.
- Expected: it should match the visual system while remaining keyboard and
  screen-reader accessible.
- Fix: retain the accessible native input but expose a styled “Görsel seç”
  control, selected-file name and local preview.
