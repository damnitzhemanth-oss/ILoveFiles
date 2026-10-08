## I ♥ Files

A local image converter and compressor that runs entirely in your browser. 
URL : https://ilovefilesbyhemanth.netlify.app/

![screenshot](images/screenshot1.png)

## Features

-Nothing leaves your device.
-No internet required.
-Compress,rotate,convert(JPEG,PNG,WebP,Gif)
-Light and Dark mode
-Pixel themed

## How it works?

Using canvas API it compresses your images to the desired quality using binary search.

## Architecture

```
 ILoveFiles
├── .vscode
│   └── settings.json
├── README.md
├── css
│   └── style.css
├── icons
│   ├── favicon.png
│   └── heart.png
├── images
│   └── screenshot1.png
├── index.html
├── js
│   ├── action.js
│   ├── compare.js
│   ├── conversion-core.js
│   ├── converter.js
│   ├── downloader.js
│   ├── dropzone.js
│   ├── filelist.js
│   ├── format-support.js
│   ├── loader.js
│   ├── main.js
│   ├── presets.js
│   ├── settings.js
│   ├── state.js
│   ├── theme.js
│   ├── views.js
│   ├── worker.js
│   └── zip.js
├── manifest.webmanifest
└── sw.js
```

## Privacy

Files never leave your device. There is no server, no API, no analytics, no tracking.

The only network requests the app makes:

- **Google Fonts** — typography (Pixelify Sans, Press Start 2P)
- **Pico.css CDN** — base styles
- **JSZip CDN** — batch ZIP download, only loaded when you click "Download ZIP"

## Installation

### Use it as an app (no install required)

Just open the live URL. That's it. It works on desktop and mobile.

### Install it as a PWA

 You can install it like a native app. It then launches from your desktop and is fully offline 

**Chrome / Edge (desktop):**
1. Open the live URL
2. Look for the **install icon** in the address bar
3. Click it → **Install**
4. The app opens in its own window and appears in your Start menu / Applications folder

**Android (Chrome):**
1. Open the live URL
2. Tap the **⋮** menu → **Add to Home screen** → **Install**
3. The app icon appears on your home screen

**iOS (Safari):**
1. Open the live URL
2. Tap the **Share** button (square with arrow)
3. Scroll down → **Add to Home Screen** → **Add**

Once installed, everything runs locally. Airplane mode works. And no snitches / trackers to see your cats picture!


## License

MIT. Do whatever you want, but don't create a black hole out of it.
