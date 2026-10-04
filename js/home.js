/* Home poster behaviour: entrance cleanup, lily sizing, mouse morph-reveal trail. */
(function () {
    "use strict";

    var poster = document.getElementById("homePage");
    if (!poster) return;

    var stage = poster.querySelector(".stage");
    var flower = document.getElementById("flower");
    var bgLayer = document.getElementById("flowerBg");
    var topLayer = document.getElementById("flowerTop");

    /* ---------- entrance: remove .anim once, never replay ---------- */
    (function () {
        var done = false;
        function finish() {
            if (done) return;
            done = true;
            poster.classList.remove("anim");
            poster.removeEventListener("animationend", check);
        }
        function check() {
            var running = poster.getAnimations ? poster.getAnimations({ subtree: true }).some(function (a) {
                return a.playState === "running" || a.playState === "pending";
            }) : false;
            if (!running) finish();
        }
        poster.addEventListener("animationend", check);
        setTimeout(finish, 6000);
    })();

    /* ---------- keep the lily's real proportions so it resizes cleanly ---------- */
    var sizer = flower.querySelector(".flower__sizer");
    function setRatio() {
        if (sizer.naturalWidth && sizer.naturalHeight) {
            poster.style.setProperty("--ar", (sizer.naturalWidth / sizer.naturalHeight).toFixed(4));
        }
    }
    if (sizer.complete) setRatio();
    sizer.addEventListener("load", setRatio);

    /* ---------- morph-reveal trail ---------- */
    var TRAIL_MAX_POINTS = 60;
    var TRAIL_HEAD_R = 140;
    var TRAIL_NOISE_AMP = 44;
    var TRAIL_BLOB_PTS = 24;
    var TRAIL_FADE_SPEED = 0.92;
    var TRAIL_SAMPLE_DIST = 8;
    var MASK_SCALE = 0.5; /* mask canvas resolution, keeps toDataURL fast */

    function drawMorphBlob(ctx, cx, cy, r, t, seed) {
        if (r < 2) return;
        var N = TRAIL_BLOB_PTS, pts = [], i;
        for (i = 0; i < N; i++) {
            var angle = (i / N) * Math.PI * 2;
            var n1 = Math.sin(angle * 3 + t * 1.4 + seed) * 0.45;
            var n2 = Math.sin(angle * 5 - t * 0.9 + seed * 2.3) * 0.3;
            var n3 = Math.cos(angle * 2 + t * 1.8 + seed * 0.7) * 0.25;
            var noise = (n1 + n2 + n3) * TRAIL_NOISE_AMP * (r / TRAIL_HEAD_R);
            pts.push({ x: cx + Math.cos(angle) * (r + noise), y: cy + Math.sin(angle) * (r + noise) });
        }
        ctx.beginPath();
        var last = pts[N - 1];
        ctx.moveTo((last.x + pts[0].x) / 2, (last.y + pts[0].y) / 2);
        for (i = 0; i < N; i++) {
            var p = pts[i], q = pts[(i + 1) % N];
            ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
        }
        ctx.closePath();
        ctx.fill();
    }

    function MorphTrailLayer(layerEl, invert) {
        this.layer = layerEl;
        this.invert = invert;
        this.canvas = document.createElement("canvas");
        this.canvas.style.display = "none";
        layerEl.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.w = 0;
        this.h = 0;
    }

    MorphTrailLayer.prototype.resize = function (w, h) {
        this.w = w;
        this.h = h;
        this.canvas.width = Math.max(1, Math.round(w * MASK_SCALE));
        this.canvas.height = Math.max(1, Math.round(h * MASK_SCALE));
        this.ctx.setTransform(MASK_SCALE, 0, 0, MASK_SCALE, 0, 0);
    };

    MorphTrailLayer.prototype.paint = function (blobs, time) {
        var ctx = this.ctx;
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, this.w, this.h);
        ctx.fillStyle = "#fff";
        if (!this.invert) {
            ctx.fillRect(0, 0, this.w, this.h);
            ctx.globalCompositeOperation = "destination-out";
        }
        for (var i = 0; i < blobs.length; i++) {
            var b = blobs[i];
            ctx.globalAlpha = b.alpha;
            drawMorphBlob(ctx, b.x, b.y, b.r, time, b.seed);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        var url = "url(" + this.canvas.toDataURL() + ")";
        var st = this.layer.style;
        st.webkitMaskImage = url;
        st.maskImage = url;
        st.webkitMaskSize = "100% 100%";
        st.maskSize = "100% 100%";
        st.webkitMaskRepeat = "no-repeat";
        st.maskRepeat = "no-repeat";
    };

    MorphTrailLayer.prototype.reset = function () {
        var st = this.layer.style;
        if (this.invert) {
            st.webkitMaskImage = "";
            st.maskImage = "";
        } else {
            st.webkitMaskImage = "none";
            st.maskImage = "none";
        }
    };

    var layers = [new MorphTrailLayer(bgLayer, false), new MorphTrailLayer(topLayer, true)];
    var points = [];
    var hovering = false;
    var headRadius = 0;
    var time = 0;
    var mouse = { x: 0, y: 0 };
    var lastSample = null;
    var wasActive = false;

    function resizeLayers() {
        var w = flower.offsetWidth, h = flower.offsetHeight;
        if (!w || !h) return;
        layers.forEach(function (l) { l.resize(w, h); });
    }
    if (window.ResizeObserver) new ResizeObserver(resizeLayers).observe(flower);
    window.addEventListener("resize", resizeLayers);
    resizeLayers();

    function toFlowerSpace(e) {
        var rect = flower.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        mouse.x = (e.clientX - rect.left) * (flower.offsetWidth / rect.width);
        mouse.y = (e.clientY - rect.top) * (flower.offsetHeight / rect.height);
    }

    stage.addEventListener("pointerenter", function (e) { toFlowerSpace(e); hovering = true; });
    stage.addEventListener("pointermove", function (e) { toFlowerSpace(e); hovering = true; });
    stage.addEventListener("pointerleave", function () { hovering = false; lastSample = null; });
    stage.addEventListener("pointercancel", function () { hovering = false; lastSample = null; });

    function frame() {
        requestAnimationFrame(frame);
        if (poster.classList.contains("hidden")) return;

        var targetR = hovering ? TRAIL_HEAD_R : 0;
        headRadius += (targetR - headRadius) * (hovering ? 0.14 : 0.04);

        if (hovering && headRadius > 5) {
            var far = !lastSample || Math.hypot(mouse.x - lastSample.x, mouse.y - lastSample.y) > TRAIL_SAMPLE_DIST;
            if (far) {
                points.push({ x: mouse.x, y: mouse.y, r: headRadius, alpha: 1, seed: Math.random() * 100 });
                if (points.length > TRAIL_MAX_POINTS) points.shift();
                lastSample = { x: mouse.x, y: mouse.y };
            }
        }

        for (var i = points.length - 1; i >= 0; i--) {
            var p = points[i];
            p.alpha *= TRAIL_FADE_SPEED;
            p.r *= 0.995;
            if (p.alpha < 0.01) points.splice(i, 1);
        }
        time += 0.016;

        var active = points.length > 0 || (hovering && headRadius > 5);
        if (!active) {
            if (wasActive) layers.forEach(function (l) { l.reset(); });
            wasActive = false;
            return;
        }
        wasActive = true;

        var blobs = points.slice();
        if (hovering && headRadius > 5) blobs.push({ x: mouse.x, y: mouse.y, r: headRadius, alpha: 1, seed: 7 });
        layers.forEach(function (l) { l.paint(blobs, time); });
    }
    requestAnimationFrame(frame);
})();
