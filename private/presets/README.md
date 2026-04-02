# Preset Files

Drop your preset zip files here before deploying.

Expected files:
- `warm-editorial.zip`
- `cool-film.zip`

These files are served via `/api/download` after payment verification.
This directory is NOT served statically — files are only accessible through the protected API route.
