(function () {
    "use strict";

    /* Shared organic mouse morph-reveal for both lilies. */
    const CFG = {
        TRAIL_MAX_POINTS: 60,
        TRAIL_HEAD_R: 140,
        TRAIL_NOISE_AMP: 44,
        TRAIL_BLOB_PTS: 24,
        TRAIL_FADE_SPEED: 0.92,
        TRAIL_SAMPLE_DIST: 8
    };

    const flowers = Array.prototype.slice.call(document.querySelectorAll(".backdrop-flower"));
    if (!flowers.length) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instances = flowers.map(function (flower) {
        const frontLayer = flower.querySelector(".backdrop-flower__layer--front");
        const revealLayer = flower.querySelector(".backdrop-flower__layer--reveal");
        const frontCanvas = document.createElement("canvas");
        const revealCanvas = document.createElement("canvas");
        const frontCtx = frontCanvas.getContext("2d");
        const revealCtx = revealCanvas.getContext("2d");

        return {
            flower,
            frontLayer,
            revealLayer,
            frontCanvas,
            revealCanvas,
            frontCtx,
            revealCtx,
            trail: [],
            lastSample: null,
            lastSize: "",
            hovering: false,
            headRadius: 0,
            time: 0
        };
    });

    let raf = 0;

    function resizeInstance(instance) {
        const rect = instance.flower.getBoundingClientRect();
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));
        const size = w + "x" + h;
        if (size === instance.lastSize) return;
        instance.lastSize = size;
        instance.frontCanvas.width = w;
        instance.frontCanvas.height = h;
        instance.revealCanvas.width = w;
        instance.revealCanvas.height = h;
        instance.lastSample = null;
    }

    function resize() {
        instances.forEach(resizeInstance);
    }

    function drawMorphBlob(ctx, cx, cy, r, t, seed) {
        if (r < 2) return;

        const pts = [];
        for (let i = 0; i < CFG.TRAIL_BLOB_PTS; i++) {
            const angle = (Math.PI * 2 * i) / CFG.TRAIL_BLOB_PTS;
            const n1 = Math.sin(angle * 3 + t * 1.4 + seed) * 0.45;
            const n2 = Math.sin(angle * 5 - t * 0.9 + seed * 2.3) * 0.30;
            const n3 = Math.cos(angle * 2 + t * 1.8 + seed * 0.7) * 0.25;
            const noise = (n1 + n2 + n3) * CFG.TRAIL_NOISE_AMP * (r / CFG.TRAIL_HEAD_R);
            const rr = r + noise;
            pts.push({
                x: cx + Math.cos(angle) * rr,
                y: cy + Math.sin(angle) * rr
            });
        }

        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            const n = pts[(i + 1) % pts.length];
            const mx = (p.x + n.x) / 2;
            const my = (p.y + n.y) / 2;
            if (i === 0) ctx.moveTo(mx, my);
            ctx.quadraticCurveTo(p.x, p.y, mx, my);
        }
        ctx.closePath();
        ctx.fill();
    }

    function drawInstance(instance) {
        const w = instance.frontCanvas.width;
        const h = instance.frontCanvas.height;
        const fc = instance.frontCtx;
        const rc = instance.revealCtx;

        fc.clearRect(0, 0, w, h);
        rc.clearRect(0, 0, w, h);

        /* Front mask: white means visible, transparent means punched out. */
        fc.save();
        fc.globalCompositeOperation = "source-over";
        fc.fillStyle = "#fff";
        fc.fillRect(0, 0, w, h);
        fc.globalCompositeOperation = "destination-out";

        /* Reveal mask: white exists only where the trail is drawn. */
        rc.save();
        rc.globalCompositeOperation = "source-over";
        rc.fillStyle = "#fff";

        instance.trail.forEach(function (p) {
            fc.globalAlpha = p.alpha;
            rc.globalAlpha = p.alpha;
            drawMorphBlob(fc, p.x, p.y, p.r, instance.time, p.seed);
            drawMorphBlob(rc, p.x, p.y, p.r, instance.time, p.seed);
        });

        fc.restore();
        rc.restore();

        const frontURL = "url(" + instance.frontCanvas.toDataURL("image/png") + ")";
        const revealURL = "url(" + instance.revealCanvas.toDataURL("image/png") + ")";
        instance.frontLayer.style.webkitMaskImage = frontURL;
        instance.frontLayer.style.maskImage = frontURL;
        instance.revealLayer.style.webkitMaskImage = revealURL;
        instance.revealLayer.style.maskImage = revealURL;
    }

    function inside(instance, x, y) {
        const rect = instance.flower.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function addSample(instance, clientX, clientY) {
        const rect = instance.flower.getBoundingClientRect();
        const localX = clientX - rect.left;
        // The left lily is visually mirrored with scaleX(-1), so its mask
        // coordinates must be mirrored too. This keeps the morph under the
        // actual cursor position: right side -> right side, left -> left.
        const x = instance.flower.classList.contains("backdrop-flower--left")
            ? rect.width - localX
            : localX;
        const y = clientY - rect.top;
        const sample = { x, y };

        if (!instance.lastSample || Math.hypot(x - instance.lastSample.x, y - instance.lastSample.y) > CFG.TRAIL_SAMPLE_DIST) {
            instance.trail.push({
                x,
                y,
                r: instance.headRadius,
                alpha: 1,
                seed: Math.random() * 100
            });
            while (instance.trail.length > CFG.TRAIL_MAX_POINTS) instance.trail.shift();
            instance.lastSample = sample;
        }
    }

    window.addEventListener("mousemove", function (event) {
        instances.forEach(function (instance) {
            instance.hovering = inside(instance, event.clientX, event.clientY);
            if (instance.hovering) {
                if (instance.headRadius > 5) addSample(instance, event.clientX, event.clientY);
            } else {
                instance.lastSample = null;
            }
        });
    }, { passive: true });

    function clearHoverState() {
        instances.forEach(function (instance) {
            instance.hovering = false;
            instance.lastSample = null;
        });
    }

    window.addEventListener("mouseleave", clearHoverState);
    window.addEventListener("blur", clearHoverState);

    window.addEventListener("resize", resize, { passive: true });

    function tick() {
        instances.forEach(function (instance) {
            const targetR = instance.hovering ? CFG.TRAIL_HEAD_R : 0;
            const ease = instance.hovering ? 0.14 : 0.04;
            instance.headRadius += (targetR - instance.headRadius) * ease;
            instance.time += 0.016;

            for (let i = instance.trail.length - 1; i >= 0; i--) {
                const p = instance.trail[i];
                p.alpha *= CFG.TRAIL_FADE_SPEED;
                p.r *= 0.995;
                if (p.alpha < 0.01) instance.trail.splice(i, 1);
            }
            drawInstance(instance);
        });

        raf = requestAnimationFrame(tick);
    }

    resize();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
})();

