<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>Hulagway</title>
    <meta name="description" content="Your little online photobooth.">
    <meta name="theme-color" content="#c45c74">
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Great+Vibes&family=Nunito:wght@400;500;600;700&family=Special+Elite&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/home.css">
</head>
<body>
    <div id="homePage" class="poster anim">
        <div class="stage" id="stage">
            <h1 class="lily-word" id="lily-title" aria-label="Hulagway">
                <span class="lily-word__mask">
                    <span class="lily-word__inner">
                        <span class="lily-word__white"><span class="lily-word__o">HULAGWAY</span>
                    </span>
                </span>
            </h1>

            <div class="flower" id="flower">
                <img class="flower__sizer" src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png&w=1280&q=85" alt="" aria-hidden="true">
                <div class="flower__layer flower__layer--bg" id="flowerBg">
                    <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png&w=1280&q=85" alt="Pixel-art pink and violet lily">
                </div>
                <div class="flower__layer flower__layer--top" id="flowerTop" aria-hidden="true">
                    <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_151324_bf318a5f-5525-4fc7-aab5-e9a341018828.png&w=1280&q=85" alt="">
                </div>
            </div>
            <div class="photos" aria-hidden="true">
                <div class="photo photo--grid"><img src="img/strip-grid-lavender.jpg" alt=""></div>
                <div class="photo photo--hearts"><img src="img/strip-hearts.jpg" alt=""></div>
                <div class="photo photo--film"><img src="img/strip-film.jpg" alt=""></div>
                <div class="photo photo--pizza"><img src="img/polaroid-pizza.jpg" alt=""></div>
            </div>
            <p class="support-copy support-copy--left"><span class="support-copy__inner">Your little,<br>online photobooth.</span></p>
            <p class="support-copy support-copy--right"><span class="support-copy__inner">Strike a pose.<br>Keep the memory.</span></p>

            <div class="dock">
                <button id="startButton" class="btn primary glass" type="button">Start</button>
                <footer class="home-footer">
                    <button type="button" id="privacyLink" class="text-link glass">Privacy</button>
                    <button type="button" id="howLink" class="btn secondary glass how-btn">How to use</button>
                    <button type="button" id="aboutLink" class="text-link glass">About</button>
                </footer>
            </div>

        </div>
    </div>

    <div id="soloPage" class="page hidden">
        <h1>Choose your layout</h1>
        <div class="layout-grid">
            <button type="button" class="layout-card" id="classicButton" data-layout="classic">
                <span class="mini-frame mini-classic" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                <span class="layout-name">Classic Strip</span>
                <span class="layout-meta">1 × 4 · 4 photos</span>
            </button>
            <button type="button" class="layout-card" id="gridButton" data-layout="grid">
                <span class="mini-frame mini-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                <span class="layout-name">Four Grid</span>
                <span class="layout-meta">2 × 2 · 4 photos</span>
            </button>
            <button type="button" class="layout-card" id="polaroidButton" data-layout="polaroid">
                <span class="mini-frame mini-polaroid" aria-hidden="true"><i></i></span>
                <span class="layout-name">Polaroid</span>
                <span class="layout-meta">1 × 1 · 1 photo</span>
            </button>
            <button type="button" class="layout-card" id="filmButton" data-layout="film">
                <span class="mini-frame mini-film" aria-hidden="true"><i></i><i></i></span>
                <span class="layout-name">Film Strip</span>
                <span class="layout-meta">1 × 2 · 2 photos</span>
            </button>
        </div>
        <button type="button" id="backButton" class="text-link glass">Back</button>
    </div>

    <div id="capturePage" class="page hidden">
        <p class="eyebrow" id="captureEyebrow">Classic Strip</p>
        <h1>Take your photos</h1>
        <p class="meta" id="photoProgress">0 of 4 captured</p>

        <div id="frameWrap">
            <div id="photoFrame"></div>
        </div>

        <p class="hint" id="captureHint">Press Take photo, Enter, or Space. Hover over a photo to delete it.</p>
        <p class="hint error hidden" id="captureError"></p>

        <div class="actions sticky-actions">
            <button type="button" id="takePhotoButton" class="btn primary">Take photo</button>
            <button type="button" id="uploadButton" class="btn secondary">Upload</button>
            <button type="button" id="customizeButton" class="btn primary hidden">Customize</button>
            <button type="button" id="resetButton" class="btn ghost hidden">Reset</button>
            <button type="button" id="captureBackButton" class="btn ghost">Back</button>
        </div>
        <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp,image/gif" hidden>
        <video id="camera" autoplay muted playsinline></video>
        <div id="countdown"></div>
    </div>

    <div id="customizePage" class="page hidden">
        <p class="eyebrow">Customize</p>
        <h1>Dress the strip</h1>
        <div class="customize-layout">
            <div id="previewWrap"></div>
            <div class="panel">
                <fieldset>
                    <legend>Background color</legend>
                    <div id="swatchRow" class="chip-row"></div>
                    <p class="tiny" id="bgHint"></p>
                </fieldset>
                <fieldset>
                    <legend>Pattern</legend>
                    <div id="patternRow" class="chip-row"></div>
                </fieldset>
                <fieldset>
                    <legend>Filter</legend>
                    <div id="filterRow" class="chip-row"></div>
                </fieldset>
                <label class="caption-label">
                    Caption
                    <input id="captionInput" type="text" maxlength="20" placeholder="Best Day">
                    <span id="captionCount" class="tiny">0/20</span>
                </label>
                <fieldset>
                    <legend>Font</legend>
                    <div id="fontRow" class="chip-row"></div>
                </fieldset>
                <p class="hint error hidden" id="generateError"></p>
                <button type="button" id="generateButton" class="btn primary wide">Generate photo</button>
                <button type="button" id="retakeButton" class="btn ghost wide">Retake photos</button>
            </div>
        </div>
    </div>

    <div id="finalPage" class="page hidden">
        <h1>Ready to keep</h1>
        <img id="finalImage" alt="Finished Hulagway photobooth">
        <div class="actions">
            <button type="button" id="downloadButton" class="btn primary">Download</button>
            <button type="button" id="finalBackButton" class="btn secondary">Back</button>
            <button type="button" id="againButton" class="btn ghost">Again</button>
        </div>
        <button type="button" id="finalHomeButton" class="text-link">Home</button>
    </div>

    <div id="howPage" class="page hidden info-page">
        <p class="eyebrow">Hulagway</p>
        <h1>How to use</h1>
        <ol class="steps">
            <li>
                <strong>Pick a layout</strong>
                <span>Strip, grid, polaroid, or film.</span>
            </li>
            <li>
                <strong>Take photos</strong>
                <span>A 3-second countdown for each slot.</span>
            </li>
            <li>
                <strong>Make it yours</strong>
                <span>Color, pattern, caption, then download.</span>
            </li>
        </ol>
        <button type="button" class="btn ghost info-back">Back to Hulagway</button>
    </div>

    <div id="aboutPage" class="page hidden info-page">
        <p class="eyebrow">Hulagway</p>
        <h1>About</h1>
        <p>Hulagway is a small digital photobooth for one person at a time. Pick a layout, take the photos, add a caption, and download a PNG strip.</p>
        <p>Solo Mode includes Classic Strip, Four Grid, Polaroid, and Film Strip. Each layout has its own patterns.</p>
        <button type="button" class="btn ghost info-back">Back to Hulagway</button>
    </div>

    <div id="privacyPage" class="page hidden info-page">
        <p class="eyebrow">Hulagway</p>
        <h1>Privacy</h1>
        <p>Hulagway uses your camera only after you choose a layout, and only to show a live preview in the active photo slot.</p>
        <p>Photos are captured in your browser. They stay on this device unless you download the finished PNG yourself.</p>
        <p>This version does not upload photos to a server, does not create an account, and does not keep a history of sessions.</p>
        <p>You can deny camera access and fill slots by uploading images instead. Uploaded files are read locally.</p>
        <button type="button" class="btn ghost info-back">Back to Hulagway</button>
    </div>

    <script src="js/main.js"></script>
    <script src="js/home.js"></script>
</body>
</html>
