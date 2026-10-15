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
This is generated using file structure commands.

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

This website doesn't upload anything to cloud like other compression things does. it runs in browser but can be little less responsive. In return you get max privacy, not even a pixel leaves your device, btw runs on airplane mode if someone wants so.

And this does not make any network requests as even Pico (css), Zip

## Installation

### Use in browser 
*You can Run this directly in your browser*

Open : https://ilovefilesbyhemanth.netlify.app/ 
and use it, copy images might not work on some browsers though.

### Installation for Windows/MacOs/Linux

Step 1: Download this GitHub repo as Zip.
    You can also clone the repo.

Step 2 : Extract the zip file.

Step 3 : Open the folder in VS Code and right click the "index.html" and press open with live server (must install live server extension).

Step 4 : If VS code is not available, manually navigate to ilovefiles folder in CMD by using cd commands.
Example : **Assuming you installed ilovefiles and extracted zip in C:/Documents**
```
##Type this in terminal

cd C:/Documents/ilovefiles
```

Step 5: Once in the folder run the following command (python must installed)

```
python -m http.server 8000
```

or

```
python3 -m http.server 8000
```

Step 6: Open the live server by pasting the following URL in your browser.

```
http://localhost:8000
```

**Note: Don't run individual files like index.html as buttons and themes which depended on CSS,JS will not run,  if these steps feels heavy use the website in web**



### Installation for Mobile users.

Open the URL
https://ilovefilesbyhemanth.netlify.app/ 

and click on the three dots on top right corner and press "Install and create shortcut". If not available in google, open this link in Chrome.

## AI usage 
Used AI for mainly debugging and assistance in CSS and JS. Didn't copy paste entire code.
## License

MIT. Do whatever you want, but don't create a black hole out of it.
