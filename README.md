# AN.NGUYEN — Video Editor / Digital Archive

A responsive retro Windows-inspired video editing portfolio for GitHub Pages.

## Files
- `index.html` — page structure and accessible dialog markup.
- `styles.css` — pixel-blue theme, responsive layout, folder cards, About popup and player sizes.
- `script.js` — project data, folder navigation, YouTube player lifecycle, Previous/Next and playlist.
- `assets/` — generated pixel-art background and four folder illustrations.

## Edit videos
Open `script.js` and edit the `projects` object near the top. Each video has:
- `title`: project name shown in the card and player.
- `note`: short description.
- `url`: YouTube URL or Shorts URL.

Folder ratios are fixed in the data: `social` and `product` use vertical 9:16; `event` and `documentary` use horizontal 16:9. Add videos to the `videos` array in the matching folder. The Previous/Next buttons and playlist use that folder's list.

When a different video is selected, the previous iframe is removed before the new one is created. Closing the player, closing the folder or clicking HOME removes the iframe to stop playback/audio.

## Change images and copy
- Replace `assets/an-nguyen-portrait.jpg` with your own portrait (update the image path in `index.html` if you use a different filename).
- Replace the four `assets/folder-*.png` images if you make updated folder assets. Folder names and descriptions are HTML text, not baked into the images.
- Replace `assets/blue-pixel-city-background.png` to change the background.
- Edit About Me content in the `about-modal` section in `index.html`.
- Update the contact email in the footer before publishing; it is currently a placeholder (`hello@example.com`).

## Publish on GitHub Pages
1. Upload the contents of this ZIP to the root of your GitHub repository (keep `index.html`, `styles.css`, `script.js`, and `assets/` together).
2. In repository **Settings → Pages**, select the branch and root folder, then save.
3. Wait for GitHub Pages to publish and open the generated URL.

No build step or external JavaScript library is required. YouTube thumbnails and playback need an internet connection.


Visual update: folder artwork PNGs use transparent backgrounds; the supplied An Nguyen portrait is stored at `assets/an-nguyen-portrait.jpg`. The cloud layer animates behind the main desktop window and respects reduced-motion preferences. Vertical video player windows are constrained to a portrait-sized shell.
