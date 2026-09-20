/* Hulagway Solo Mode
   Add custom PNG/SVG frames in /designs and list them in FRAMES below. */

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

const PATTERNS = ["none", "hearts", "stars", "flowers", "polka", "checker", "clouds", "bows", "sparkles", "doodles", "stripes"];

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

const FRAMES = [
    { id: "none", name: "Plain", src: "" },
    { id: "hearts", name: "Hearts", src: "D:\hulagway 4\designs\hearts.svg" },
    { id: "bows", name: "Bows", src: "D:\hulagway 4\designs\bows.svg" },
    { id: "floral", name: "Floral", src: "D:\hulagway 4\designs\floral.svg" },
    { id: "film", name: "Film", src: "D:\hulagway 4\designs\film.svg" }
];

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
let swatch = "pink";
let pattern = "none";
let filter = "original";
let font = "serif";
let frameId = "none";
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
        slot.addEventListener("click", function () {
            if (photos[i]) {
                currentPhoto = i;
                placeCamera();
            }
        });
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
    document.querySelector("#captureEyebrow").textContent = spec.name;
    document.querySelector("#photoProgress").textContent = filledCount() + " of " + spec.count + " captured";
    document.querySelector("#resetButton").classList.toggle("hidden", filledCount() === 0);
    document.querySelector("#customizeButton").classList.toggle("hidden", filledCount() !== spec.count);
}

function placeCamera() {
    slots.forEach(function (slot, i) {
        slot.querySelectorAll(".slot-msg").forEach(function (n) { n.remove(); });
        const img = slot.querySelector("img");
        if (photos[i] && i !== currentPhoto) {
            if (!img) {
                const image = document.createElement("img");
                image.alt = "Photo " + (i + 1);
                slot.appendChild(image);
            }
            slot.querySelector("img").src = photos[i];
        } else if (img && i !== currentPhoto) {
            img.remove();
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

    if (cameraState !== "live" && !photos[currentPhoto]) {
        const msg = document.createElement("div");
        msg.className = "slot-msg";
        msg.textContent = cameraState === "requesting" ? "Waiting for camera…" : "Upload a photo for this slot";
        slot.appendChild(msg);
    }
}

function startCamera() {
    cameraState = "requesting";
    placeCamera();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraState = "denied";
        document.querySelector("#captureHint").textContent = "Camera access was denied. Upload a photo for each slot instead.";
        placeCamera();
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then(function (stream) {
            cameraStream = stream;
            camera.srcObject = stream;
            camera.play().catch(function () {});
            cameraState = "live";
            document.querySelector("#captureHint").textContent = "Press Take photo, Enter, or Space. Click a photo to retake it.";
            placeCamera();
        })
        .catch(function () {
            cameraState = "denied";
            document.querySelector("#captureHint").textContent = "Camera access was denied. Upload a photo for each slot instead.";
            placeCamera();
        });
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(function (track) { track.stop(); });
        cameraStream = null;
    }
    camera.srcObject = null;
    cameraState = "idle";
}

function openCapture(id) {
    selectedLayout = id;
    const spec = layout();
    photos = Array(spec.count).fill(null);
    currentPhoto = 0;
    countdownRunning = false;
    countdown.textContent = "";
    takePhotoButton.disabled = false;
    buildSlots();
    updateProgress();
    document.querySelector("#captureError").classList.add("hidden");
    show(capturePage);
    startCamera();
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
    photos[currentPhoto] = dataUrl;
    const next = photos.findIndex(function (p) { return !p; });
    currentPhoto = next === -1 ? -1 : next;
    placeCamera();
    updateProgress();
}

function showError(text) {
    const el = document.querySelector("#captureError");
    el.textContent = text;
    el.classList.remove("hidden");
}

function startCountdown() {
    if (countdownRunning) return;
    if (cameraState !== "live") {
        fileInput.click();
        return;
    }
    countdownRunning = true;
    takePhotoButton.disabled = true;
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
        putPhoto(captureFromVideo());
        countdownRunning = false;
        takePhotoButton.disabled = false;
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
    photos = Array(layout().count).fill(null);
    currentPhoto = 0;
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
        b.onclick = function () { swatch = s.id; renderCustomize(); };
        swatchRow.appendChild(b);
    });

    const patternRow = document.querySelector("#patternRow");
    patternRow.innerHTML = "";
    PATTERNS.forEach(function (id) {
        patternRow.appendChild(chip(id[0].toUpperCase() + id.slice(1), pattern === id, function () {
            pattern = id;
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

    const frameRow = document.querySelector("#frameRow");
    frameRow.innerHTML = "";
    FRAMES.forEach(function (f) {
        frameRow.appendChild(chip(f.name, frameId === f.id, function () {
            frameId = f.id;
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
    const hex = SWATCHES.find(function (s) { return s.id === swatch; }).hex;
    frame.style.background = hex;
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
    frame.appendChild(cap);
    return frame;
}

function paintPattern(ctx, id, width, height) {
    if (id === "none") return;
    ctx.fillStyle = "rgba(61,44,50,0.1)";
    ctx.strokeStyle = "rgba(61,44,50,0.1)";
    if (id === "checker") {
        for (let y = 0; y < height; y += 18) {
            for (let x = 0; x < width; x += 18) {
                if (((x / 18) + (y / 18)) % 2 === 0) ctx.fillRect(x, y, 18, 18);
            }
        }
        return;
    }
    if (id === "stripes") {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(-Math.PI / 8);
        for (let x = -width; x < width; x += 16) ctx.fillRect(x, -height, 7, height * 2);
        ctx.restore();
        return;
    }
    if (id === "polka") {
        for (let y = 10; y < height; y += 28) {
            for (let x = 10; x < width; x += 28) {
                ctx.beginPath();
                ctx.arc(x, y, 3.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        return;
    }
    const step = 36;
    for (let y = 14; y < height; y += step) {
        for (let x = 14; x < width; x += step) {
            ctx.beginPath();
            if (id === "stars" || id === "sparkles") {
                ctx.moveTo(x, y - 5);
                ctx.lineTo(x, y + 5);
                ctx.moveTo(x - 5, y);
                ctx.lineTo(x + 5, y);
                ctx.stroke();
            } else {
                ctx.arc(x, y, id === "hearts" ? 4 : 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
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
    const hex = SWATCHES.find(function (s) { return s.id === swatch; }).hex;
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, size.width, size.height);
    paintPattern(ctx, pattern, size.width, size.height);

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
        ctx.fillStyle = "#3d2c32";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = f.weight + " " + f.size + "px " + f.css;
        const captionY = spec.pad + spec.rows * spec.slotH + (spec.rows - 1) * spec.gap;
        ctx.fillText(caption.trim(), size.width / 2, captionY + spec.captionH / 2, size.width - spec.pad * 2);
    }

    const chosen = FRAMES.find(function (f) { return f.id === frameId; });
    if (chosen && chosen.src) {
        try {
            const overlay = await loadImage(chosen.src);
            ctx.drawImage(overlay, 0, 0, size.width, size.height);
        } catch (e) {}
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
