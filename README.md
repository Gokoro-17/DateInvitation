# Date Invitation 💌

A mobile-first, no-backend date invitation built with plain HTML, CSS, and JavaScript.

## Personalize it

Open `script.js` and edit the `CONFIG` object at the very top:

- `yourName`
- `introImageUrl` and `introImageAlt`
- `imageUrl` and `imageAlt`
- `reactionImageUrl` and `reactionImageAlt`
- `scheduleImageUrl` and `scheduleImageAlt`
- `finalImageUrl` and `finalImageAlt`
- the main color palette
- the headline, reaction, final-screen, and funny hint messages

The intro doodle is saved as `assets/intro-doodle.png`; the other supplied images are saved as `invitation-photo.png`, `reaction-photo.png`, `schedule-photo.png`, and `final-photo.png`. To change any of them later, add your image to `assets` and update its URL in `CONFIG`.

## Personalized links

Add `?name=` followed by **any name you choose** to the same deployed website URL. No code edit or redeploy is needed for each person:

- `https://dateinvitation-eight.vercel.app/?name=YourChosenName`
- For a two-word name: `https://dateinvitation-eight.vercel.app/?name=First%20Last`

Spaces and other special characters should be URL-encoded. Without a name, the intro says “Hey, you...” and the other pages use their original wording. The fallback can be changed with `defaultInviteeName` in `CONFIG`.

On the final page, the celebration chime plays when the confetti appears. The **Share the plan** button opens the phone's share sheet with the invitee's name (when provided), chosen date, time, food, and chaos level. She must select your chat/contact and send it; nothing is sent automatically. If sharing is unavailable, the details can be copied instead.

## Preview locally

You can open `index.html` directly, or serve the folder with any static server. For example:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy

This site has no build command and no environment variables. Drag the whole folder into Netlify, import it into Vercel, or upload it to Replit as a static HTML/CSS/JavaScript project. The publish directory is the project root.
