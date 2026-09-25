/* Hulagway Solo Mode
   Patterns: each layout has its own 5 patterns (see PATTERNS below).
   To use your own artwork, save a PNG in assets/patterns/<layout>/<pattern id>.png */

const LAYOUTS = {
    classic: { id: "classic", name: "Classic Strip", count: 4, columns: 1, rows: 4, slotW: 260, slotH: 174, gap: 12, pad: 20, captionH: 52 },
    grid: { id: "grid", name: "Four Grid", count: 4, columns: 2, rows: 2, slotW: 150, slotH: 150, gap: 12, pad: 20, captionH: 48 },
    polaroid: { id: "polaroid", name: "Polaroid", count: 1, columns: 1, rows: 1, slotW: 280, slotH: 300, gap: 12, pad: 18, captionH: 72 },
    film: { id: "film", name: "Film Strip", count: 2, columns: 1, rows: 2, slotW: 260, slotH: 174, gap: 12, pad: 20, captionH: 52 }
};

const SWATCHES = [
    { id: "pink", name: "Baby Pink", hex: "#f4c7d4" },
    { id: "lavender", name: "Lavender", hex: "#d9cce8" },
    { id: "blue", name: "Baby Blue", hex: "#c9def0" },
    { id: "cream", name: "Cream", hex: "#f4ead6" },
    { id: "peach", name: "Peach", hex: "#f5c9b3" },
    { id: "mint", name: "Mint", hex: "#cfe8d8" },
    { id: "yellow", name: "Butter Yellow", hex: "#f3e3a8" },
    { id: "gray", name: "Soft Gray", hex: "#d9d4d1" }
];

/* Patterns are full background pictures drawn BEHIND the photos.
   While a pattern is chosen, the background color is ignored.
   Your own PNG for a pattern goes in:  assets/patterns/<layout>/<id>.png
   (example: assets/patterns/classic/hearts.png)
   If that PNG does not exist yet, a simple built-in design is drawn instead.
   bg / ink = colors of the built-in design.  text = caption color on that pattern. */
const PATTERN_DIR = "assets/patterns";

const MOTIF_PATTERNS = [
    { id: "hearts", name: "Hearts", bg: "#f9d5e0", ink: "#e58aa6", text: "#3d2c32" },
    { id: "polka", name: "Polka Dots", bg: "#cfe3f5", ink: "#ffffff", text: "#3d2c32" },
    { id: "checker", name: "Checkered", bg: "#ffffff", ink: "#f4c7d4", text: "#3d2c32" },
    { id: "flowers", name: "Flowers", bg: "#e3f1e0", ink: "#f7b3c6", text: "#3d2c32" },
    { id: "bows", name: "Bows", bg: "#e6dcf3", ink: "#d9799a", text: "#3d2c32" }
];

const FILM_PATTERNS = [
    { id: "film-1", name: "Black Reel", bg: "#1f1719", ink: "#f3ebe4", text: "#f3ebe4" },
    { id: "film-2", name: "Pink Reel", bg: "#f4c7d4", ink: "#ffffff", text: "#3d2c32" },
    { id: "film-3", name: "Cream Reel", bg: "#f4ead6", ink: "#3d2c32", text: "#3d2c32" },
    { id: "film-4", name: "Blue Reel", bg: "#c9def0", ink: "#ffffff", text: "#3d2c32" },
    { id: "film-5", name: "Sepia Reel", bg: "#5a4038", ink: "#e7d3b8", text: "#f3e6d2" }
];

const PATTERNS = {
    classic: MOTIF_PATTERNS,
    grid: MOTIF_PATTERNS,
    polaroid: MOTIF_PATTERNS,
    film: FILM_PATTERNS
};

const DEFAULT_TEXT_COLOR = "#3d2c32";

const FILTERS = {
    original: { name: "Original", css: "none" },
    bw: { name: "Black and White", css: "grayscale(1) contrast(1.05)" },
    vintage: { name: "Vintage", css: "sepia(0.45) contrast(1.05) saturate(0.85)" },
    cool: { name: "Cool", css: "saturate(0.9) hue-rotate(12deg) brightness(1.02)" },
    warm: { name: "Warm", css: "sepia(0.18) saturate(1.15) hue-rotate(-8deg)" },
    pinkish: { name: "Pinkish", css: "saturate(1.1) hue-rotate(-18deg) brightness(1.04)" }
};

const FONTS = {
    serif: { name: "Times", css: '"Times New Roman", Times, serif', weight: "500", size: 18 },
    cursive: { name: "Cursive", css: '"Great Vibes", "Segoe Script", cursive', weight: "500", size: 28 },
    typewriter: { name: "Typewriter", css: '"Special Elite", "Courier New", monospace', weight: "500", size: 18 },
    bold: { name: "Bold", css: '"Nunito", system-ui, sans-serif', weight: "700", size: 20 }
};

const MAX_CAPTION = 20;
const MAX_UPLOAD = 8 * 1024 * 1024;
const EXPORT_SCALE = 3;

const homePage = document.querySelector("#homePage");
const soloPage = document.querySelector("#soloPage");
const capturePage = document.querySelector("#capturePage");
const customizePage = document.querySelector("#customizePage");
const finalPage = document.querySelector("#finalPage");
const aboutPage = document.querySelector("#aboutPage");
const privacyPage = document.querySelector("#privacyPage");
const photoFrame = document.querySelector("#photoFrame");
const camera = document.querySelector("#camera");
const countdown = document.querySelector("#countdown");
const takePhotoButton = document.querySelector("#takePhotoButton");
const fileInput = document.querySelector("#fileInput");

let selectedLayout = "classic";
let currentPhoto = 0;
let photos = [];
let slots = [];
let countdownRunning = false;
let cameraStream = null;
let cameraState = "idle";
let cameraToken = 0;
let swatch = "pink";
let pattern = "none";
let filter = "original";
let font = "serif";
let caption = "";
let finalUrl = "";

function show(page) {
    [homePage, soloPage, capturePage, customizePage, finalPage, aboutPage, privacyPage].forEach(function (el) {
        el.classList.toggle("hidden", el !== page);
    });
}

function layout() {
    return LAYOUTS[selectedLayout];
}

function frameSize(spec) {
    return {
        width: spec.pad * 2 + spec.columns * spec.slotW + (spec.columns - 1) * spec.gap,
        height: spec.pad + spec.rows * spec.slotH + (spec.rows - 1) * spec.gap + spec.captionH + spec.pad
    };
}

function slotPos(spec, index) {
    const col = index % spec.columns;
    const row = Math.floor(index / spec.columns);
    return {
        x: spec.pad + col * (spec.slotW + spec.gap),
        y: spec.pad + row * (spec.slotH + spec.gap),
        w: spec.slotW,
        h: spec.slotH
    };
}

function buildSlots() {
    const spec = layout();
    photoFrame.className = spec.id;
    photoFrame.innerHTML = "";
    slots = [];
    for (let i = 0; i < spec.count; i++) {
        const slot = document.createElement("div");
        slot.className = "photo-slot";
        slot.dataset.index = String(i);
        photoFrame.appendChild(slot);
        slots.push(slot);
    }
    const captionSpace = document.createElement("div");
    captionSpace.className = "caption-space";
    photoFrame.appendChild(captionSpace);
}

function filledCount() {
    return photos.filter(Boolean).length;
}

function updateProgress() {
    const spec = layout();
    const full = filledCount() === spec.count;
    document.querySelector("#captureEyebrow").textContent = spec.name;
    document.querySelector("#photoProgress").textContent = filledCount() + " of " + spec.count + " captured";
    document.querySelector("#resetButton").classList.toggle("hidden", filledCount() === 0);
    document.querySelector("#customizeButton").classList.toggle("hidden", !full);
    takePhotoButton.disabled = countdownRunning || full;
    document.querySelector("#uploadButton").disabled = full;
}

function setHint(text) {
    document.querySelector("#captureHint").textContent = text;
}

const HINT_LIVE = "Press Take photo, Enter, or Space. Hover over a photo to delete it.";
const HINT_OFF = "The camera is off. Press Take photo to ask for it again, or upload photos instead.";
const HINT_BLOCKED = "Your browser is blocking the camera. Allow it from the icon in the address bar, then press Take photo again. You can also upload photos instead.";

function makeTrashButton(index) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "trash-btn";
    btn.setAttribute("aria-label", "Delete photo " + (index + 1));
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';
    btn.onclick = function (event) {
        event.stopPropagation();
        deletePhoto(index);
    };
    return btn;
}

/* Deletes one photo. The photos after it move back one slot,
   and the camera goes to the first empty slot. */
function deletePhoto(index) {
    if (countdownRunning || !photos[index]) return;
    photos.splice(index, 1);
    photos.push(null);
    currentPhoto = photos.findIndex(function (p) { return !p; });
    document.querySelector("#captureError").classList.add("hidden");
    placeCamera();
    updateProgress();
}

function placeCamera() {
    slots.forEach(function (slot, i) {
        slot.querySelectorAll(".slot-msg").forEach(function (n) { n.remove(); });
        let img = slot.querySelector("img");
        let trash = slot.querySelector(".trash-btn");
        if (photos[i]) {
            if (!img) {
                img = document.createElement("img");
                img.alt = "Photo " + (i + 1);
                slot.appendChild(img);
            }
            if (img.getAttribute("src") !== photos[i]) img.src = photos[i];
            if (!trash) slot.appendChild(makeTrashButton(i));
        } else {
            if (img) img.remove();
            if (trash) trash.remove();
        }
    });

    if (currentPhoto < 0 || currentPhoto >= slots.length) {
        camera.style.display = "none";
        return;
    }

    const slot = slots[currentPhoto];
    slot.appendChild(camera);
    slot.appendChild(countdown);
    camera.style.display = cameraState === "live" ? "block" : "none";

    if (cameraState !== "live") {
        const msg = document.createElement("div");
        msg.className = "slot-msg";
        msg.textContent = cameraState === "requesting" ? "Waiting for camera…" : "Camera is off. Press Take photo to try again, or upload a photo.";
        slot.appendChild(msg);
    }
}

/* Starts the camera. If the browser already allows it, this just works with no question.
   If the camera is blocked, it is asked for again only when the person presses Take photo
   (fromButton = true). */
async function startCamera(fromButton) {
    const token = ++cameraToken;

    if (cameraStream && cameraStream.active) {
        camera.srcObject = cameraStream;
        cameraState = "live";
        setHint(HINT_LIVE);
        placeCamera();
        return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraState = "denied";
        setHint("This browser cannot use the camera here. Upload photos instead.");
        placeCamera();
        return;
    }

    cameraState = "requesting";
    placeCamera();

    let permission = "prompt";
    try {
        permission = (await navigator.permissions.query({ name: "camera" })).state;
    } catch (e) {}
    if (token !== cameraToken) return;

    if (permission === "denied" && !fromButton) {
        cameraState = "denied";
        setHint(HINT_OFF);
        placeCamera();
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (token !== cameraToken || capturePage.classList.contains("hidden")) {
            stream.getTracks().forEach(function (track) { track.stop(); });
            return;
        }
        cameraStream = stream;
        camera.srcObject = stream;
        camera.play().catch(function () {});
        cameraState = "live";
        setHint(HINT_LIVE);
    } catch (e) {
        if (token !== cameraToken) return;
        cameraState = "denied";
        setHint(permission === "denied" ? HINT_BLOCKED : HINT_OFF);
    }
    placeCamera();
}

function stopCamera() {
    cameraToken += 1;
    if (cameraStream) {
        cameraStream.getTracks().forEach(function (track) { track.stop(); });
        cameraStream = null;
    }
    camera.srcObject = null;
    cameraState = "idle";
}

function openCapture(id) {
    if (id !== selectedLayout) pattern = "none";
    selectedLayout = id;
    const spec = layout();
    photos = Array(spec.count).fill(null);
    currentPhoto = 0;
    countdownRunning = false;
    countdown.textContent = "";
    buildSlots();
    updateProgress();
    document.querySelector("#captureError").classList.add("hidden");
    show(capturePage);
    startCamera(false);
}

function captureFromVideo() {
    if (!camera.videoWidth) return null;
    const canvas = document.createElement("canvas");
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(camera, 0, 0);
    return canvas.toDataURL("image/png");
}

function putPhoto(dataUrl) {
    if (!dataUrl) {
        showError("The camera is still starting. Try again in a moment.");
        return;
    }
    if (currentPhoto < 0) {
        showError("All the slots are full. Hover over a photo and click the trash icon to delete one.");
        return;
    }
    document.querySelector("#captureError").classList.add("hidden");
    photos[currentPhoto] = dataUrl;
    currentPhoto = photos.findIndex(function (p) { return !p; });
    placeCamera();
    updateProgress();
}

function showError(text) {
    const el = document.querySelector("#captureError");
    el.textContent = text;
    el.classList.remove("hidden");
}

function startCountdown() {
    if (countdownRunning || cameraState === "requesting") return;
    if (currentPhoto < 0) {
        showError("All the slots are full. Hover over a photo and click the trash icon to delete one.");
        return;
    }
    if (cameraState !== "live") {
        startCamera(true);
        return;
    }
    countdownRunning = true;
    photoFrame.classList.add("busy");
    updateProgress();
    let number = 3;
    countdown.textContent = String(number);
    const timer = setInterval(function () {
        number -= 1;
        if (number > 0) {
            countdown.textContent = String(number);
            return;
        }
        clearInterval(timer);
        countdown.textContent = "";
        countdownRunning = false;
        photoFrame.classList.remove("busy");
        if (currentPhoto >= 0) putPhoto(captureFromVideo());
        updateProgress();
    }, 1000);
}

function fileToPhoto(file) {
    return new Promise(function (resolve, reject) {
        if (!file.type.startsWith("image/")) {
            reject(new Error("Please choose a JPEG, PNG, or WebP image."));
            return;
        }
        if (file.size > MAX_UPLOAD) {
            reject(new Error("That file is larger than 8 MB."));
            return;
        }
        const reader = new FileReader();
        reader.onload = function () {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const max = 1600;
                const scale = Math.min(1, max / Math.max(img.width, img.height));
                canvas.width = Math.max(1, Math.round(img.width * scale));
                canvas.height = Math.max(1, Math.round(img.height * scale));
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.92));
            };
            img.onerror = function () { reject(new Error("Could not read that image.")); };
            img.src = String(reader.result);
        };
        reader.onerror = function () { reject(new Error("Could not read that image.")); };
        reader.readAsDataURL(file);
    });
}

document.querySelector("#startButton").onclick = function () { show(soloPage); };
document.querySelector("#backButton").onclick = function () { show(homePage); };
document.querySelector("#classicButton").onclick = function () { openCapture("classic"); };
document.querySelector("#gridButton").onclick = function () { openCapture("grid"); };
document.querySelector("#polaroidButton").onclick = function () { openCapture("polaroid"); };
document.querySelector("#filmButton").onclick = function () { openCapture("film"); };
document.querySelector("#captureBackButton").onclick = function () {
    stopCamera();
    show(soloPage);
};
takePhotoButton.onclick = startCountdown;
document.querySelector("#uploadButton").onclick = function () { fileInput.click(); };
document.querySelector("#resetButton").onclick = function () {
    if (countdownRunning) return;
    photos = Array(layout().count).fill(null);
    currentPhoto = 0;
    document.querySelector("#captureError").classList.add("hidden");
    placeCamera();
    updateProgress();
};
document.querySelector("#customizeButton").onclick = function () {
    stopCamera();
    openCustomize();
};

fileInput.onchange = function () {
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = "";
    if (!file) return;
    fileToPhoto(file).then(putPhoto).catch(function (err) { showError(err.message); });
};

document.addEventListener("keydown", function (event) {
    if (capturePage.classList.contains("hidden")) return;
    const tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startCountdown();
    }
});

document.querySelector("#aboutLink").onclick = function () { show(aboutPage); };
document.querySelector("#privacyLink").onclick = function () { show(privacyPage); };
document.querySelectorAll(".info-back").forEach(function (btn) {
    btn.onclick = function () { show(homePage); };
});

function chip(label, active, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (active ? " active" : "");
    btn.textContent = label;
    btn.onclick = onClick;
    return btn;
}

function openCustomize() {
    renderCustomize();
    show(customizePage);
}

function renderCustomize() {
    const spec = layout();
    const usingPattern = currentPattern() !== null;
    const wrap = document.querySelector("#previewWrap");
    wrap.innerHTML = "";
    wrap.appendChild(makePreviewFrame(spec, photos, true));

    const swatchRow = document.querySelector("#swatchRow");
    swatchRow.innerHTML = "";
    SWATCHES.forEach(function (s) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "swatch" + (swatch === s.id ? " active" : "");
        b.title = s.name;
        b.style.background = s.hex;
        b.disabled = usingPattern;
        b.onclick = function () { swatch = s.id; renderCustomize(); };
        swatchRow.appendChild(b);
    });
    document.querySelector("#bgHint").textContent = usingPattern
        ? "Background colors are ignored while a pattern is on. Choose Plain to use a color."
        : "";

    const patternRow = document.querySelector("#patternRow");
    patternRow.innerHTML = "";
    patternRow.appendChild(chip("Plain", !usingPattern, function () {
        pattern = "none";
        renderCustomize();
    }));
    patternList().forEach(function (p) {
        patternRow.appendChild(chip(p.name, pattern === p.id, function () {
            pattern = p.id;
            renderCustomize();
        }));
    });

    const filterRow = document.querySelector("#filterRow");
    filterRow.innerHTML = "";
    Object.keys(FILTERS).forEach(function (id) {
        filterRow.appendChild(chip(FILTERS[id].name, filter === id, function () {
            filter = id;
            renderCustomize();
        }));
    });

    const fontRow = document.querySelector("#fontRow");
    fontRow.innerHTML = "";
    Object.keys(FONTS).forEach(function (id) {
        fontRow.appendChild(chip(FONTS[id].name, font === id, function () {
            font = id;
            renderCustomize();
        }));
    });

    document.querySelector("#captionInput").value = caption;
    document.querySelector("#captionCount").textContent = caption.length + "/" + MAX_CAPTION;
}

document.querySelector("#captionInput").addEventListener("input", function (event) {
    caption = event.target.value.slice(0, MAX_CAPTION);
    document.querySelector("#captionCount").textContent = caption.length + "/" + MAX_CAPTION;
    const live = document.querySelector(".preview-frame .caption-space");
    if (live) {
        live.textContent = caption;
        live.style.fontFamily = FONTS[font].css;
        live.style.fontWeight = FONTS[font].weight;
    }
});

function makePreviewFrame(spec, shotList, liveCss) {
    const frame = document.createElement("div");
    frame.className = "preview-frame " + spec.id;
    const pat = currentPattern();
    frame.style.backgroundColor = pat ? pat.bg : swatchHex();
    paintPreviewBackground(frame, spec);
    for (let i = 0; i < spec.count; i++) {
        const slot = document.createElement("div");
        slot.className = "photo-slot";
        if (shotList[i]) {
            const img = document.createElement("img");
            img.src = shotList[i];
            img.alt = "Photo " + (i + 1);
            if (liveCss) img.style.filter = FILTERS[filter].css;
            slot.appendChild(img);
        }
        frame.appendChild(slot);
    }
    const cap = document.createElement("div");
    cap.className = "caption-space";
    cap.textContent = caption;
    cap.style.fontFamily = FONTS[font].css;
    cap.style.fontWeight = FONTS[font].weight;
    cap.style.fontSize = FONTS[font].size + "px";
    cap.style.color = captionColor();
    frame.appendChild(cap);
    return frame;
}

/* ---------- Pattern helpers ---------- */

function patternList() {
    return PATTERNS[selectedLayout] || [];
}

/* Returns the chosen pattern for the current layout, or null for Plain. */
function currentPattern() {
    return patternList().find(function (p) { return p.id === pattern; }) || null;
}

function swatchHex() {
    return SWATCHES.find(function (s) { return s.id === swatch; }).hex;
}

function captionColor() {
    const pat = currentPattern();
    return pat ? pat.text : DEFAULT_TEXT_COLOR;
}

/* Points on a grid whose first/last rows and columns sit in the middle of the outer margin. */
function gridPoints(w, h, target) {
    const cols = Math.max(2, Math.round((w - 20) / target) + 1);
    const rows = Math.max(2, Math.round((h - 20) / target) + 1);
    const points = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            points.push([10 + c * (w - 20) / (cols - 1), 10 + r * (h - 20) / (rows - 1)]);
        }
    }
    return points;
}

function drawHeart(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.9);
    ctx.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.6, y - s * 1.1, x, y - s * 0.35);
    ctx.bezierCurveTo(x + s * 0.6, y - s * 1.1, x + s * 1.4, y - s * 0.1, x, y + s * 0.9);
    ctx.fill();
}

function drawFlower(ctx, x, y, s) {
    for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * s * 0.6, y + Math.sin(a) * s * 0.6, s * 0.45, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.save();
    ctx.fillStyle = "#f6d365";
    ctx.beginPath();
    ctx.arc(x, y, s * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawBow(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - s * 1.1, y - s * 0.7);
    ctx.lineTo(x - s * 1.1, y + s * 0.7);
    ctx.closePath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + s * 1.1, y - s * 0.7);
    ctx.lineTo(x + s * 1.1, y + s * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, s * 0.32, 0, Math.PI * 2);
    ctx.fill();
}

function drawCheckers(ctx, w, h) {
    const cols = Math.max(2, Math.round(w / 12));
    const size = w / cols;
    const rows = Math.max(2, Math.round(h / size));
    const sizeY = h / rows;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if ((r + c) % 2 === 0) ctx.fillRect(c * size, r * sizeY, size, sizeY);
        }
    }
}

function drawSprockets(ctx, w, h) {
    for (let y = 8; y + 12 <= h - 6; y += 22) {
        [6, w - 14].forEach(function (x) {
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, 8, 12, 2);
            else ctx.rect(x, y, 8, 12);
            ctx.fill();
        });
    }
}

/* Built-in design, used until you add your own PNG for that pattern. */
function drawBuiltInPattern(ctx, spec, pat, w, h) {
    ctx.fillStyle = pat.bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = pat.ink;
    /* keep the caption area clear so the text stays readable */
    const captionTop = spec.pad + spec.rows * spec.slotH + (spec.rows - 1) * spec.gap;
    function points(target) {
        return gridPoints(w, h, target).filter(function (p) {
            const inCaption = p[1] > captionTop - 4 && p[1] < captionTop + spec.captionH + 4;
            const inMargin = p[0] < spec.pad || p[0] > w - spec.pad;
            return !inCaption || inMargin;
        });
    }
    if (pat.id === "checker") {
        drawCheckers(ctx, w, h);
    } else if (pat.id === "polka") {
        points(20).forEach(function (p) {
            ctx.beginPath();
            ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
            ctx.fill();
        });
    } else if (pat.id === "hearts") {
        points(24).forEach(function (p) { drawHeart(ctx, p[0], p[1], 6); });
    } else if (pat.id === "flowers") {
        points(26).forEach(function (p) { drawFlower(ctx, p[0], p[1], 7); });
    } else if (pat.id === "bows") {
        points(26).forEach(function (p) { drawBow(ctx, p[0], p[1], 6); });
    } else if (pat.id.indexOf("film") === 0) {
        drawSprockets(ctx, w, h);
    }
}

const patternImages = {};

/* Loads a pattern PNG once. Resolves to null if the file does not exist. */
function loadPatternImage(src) {
    if (!(src in patternImages)) {
        patternImages[src] = loadImage(src).catch(function () { return null; });
    }
    return patternImages[src];
}

/* Paints the background: the pattern if one is chosen, otherwise the plain color. */
async function paintBackground(ctx, spec, w, h) {
    const pat = currentPattern();
    if (!pat) {
        ctx.fillStyle = swatchHex();
        ctx.fillRect(0, 0, w, h);
        return;
    }
    const img = await loadPatternImage(PATTERN_DIR + "/" + spec.id + "/" + pat.id + ".png");
    if (img) {
        ctx.drawImage(img, 0, 0, w, h);
    } else {
        drawBuiltInPattern(ctx, spec, pat, w, h);
    }
}

/* Puts the same background used for the download behind the live preview. */
async function paintPreviewBackground(frame, spec) {
    const size = frameSize(spec);
    const canvas = document.createElement("canvas");
    canvas.width = size.width * 2;
    canvas.height = size.height * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    try {
        await paintBackground(ctx, spec, size.width, size.height);
        if (!frame.isConnected) return;
        frame.style.backgroundImage = "url(" + canvas.toDataURL("image/png") + ")";
        frame.style.backgroundSize = "100% 100%";
    } catch (e) {}
}

function loadImage(src) {
    return new Promise(function (resolve, reject) {
        const img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = function () { reject(new Error("Could not load photo")); };
        img.src = src;
    });
}

function drawCover(ctx, img, x, y, w, h) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;
    const ir = iw / ih;
    const r = w / h;
    let sx = 0;
    let sy = 0;
    let sw = iw;
    let sh = ih;
    if (ir > r) {
        sw = ih * r;
        sx = (iw - sw) / 2;
    } else {
        sh = iw / r;
        sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

async function composeBooth() {
    const spec = layout();
    const size = frameSize(spec);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(size.width * EXPORT_SCALE);
    canvas.height = Math.round(size.height * EXPORT_SCALE);
    const ctx = canvas.getContext("2d");
    ctx.scale(EXPORT_SCALE, EXPORT_SCALE);
    await paintBackground(ctx, spec, size.width, size.height);

    const images = await Promise.all(photos.filter(Boolean).map(loadImage));
    images.forEach(function (img, i) {
        const pos = slotPos(spec, i);
        ctx.save();
        ctx.filter = FILTERS[filter].css;
        drawCover(ctx, img, pos.x, pos.y, pos.w, pos.h);
        ctx.restore();
    });

    if (caption.trim()) {
        await document.fonts.ready;
        const f = FONTS[font];
        ctx.fillStyle = captionColor();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = f.weight + " " + f.size + "px " + f.css;
        const captionY = spec.pad + spec.rows * spec.slotH + (spec.rows - 1) * spec.gap;
        ctx.fillText(caption.trim(), size.width / 2, captionY + spec.captionH / 2, size.width - spec.pad * 2);
    }

    return canvas;
}

document.querySelector("#generateButton").onclick = async function () {
    const err = document.querySelector("#generateError");
    err.classList.add("hidden");
    try {
        const canvas = await composeBooth();
        finalUrl = canvas.toDataURL("image/png");
        document.querySelector("#finalImage").src = finalUrl;
        show(finalPage);
    } catch (e) {
        err.textContent = "Could not generate the photo. Please try again.";
        err.classList.remove("hidden");
    }
};

document.querySelector("#retakeButton").onclick = function () { openCapture(selectedLayout); };
document.querySelector("#finalBackButton").onclick = function () { show(customizePage); renderCustomize(); };
document.querySelector("#againButton").onclick = function () { openCapture(selectedLayout); };
document.querySelector("#finalHomeButton").onclick = function () { show(homePage); };
document.querySelector("#downloadButton").onclick = function () {
    if (!finalUrl) return;
    const a = document.createElement("a");
    a.href = finalUrl;
    a.download = "hulagway-solo-photo.png";
    a.click();
};
