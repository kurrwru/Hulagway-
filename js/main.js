:root {
    --bg: #f3ebe4;
    --surface: #fffaf6;
    --fg: #3d2c32;
    --muted: #8a6d76;
    --primary: #c45c74;
    --primary-fg: #fffaf6;
    --frame: #ffffff;
    --slot: #efe4df;
    --shadow: 0 0 0 1px rgba(61, 44, 50, 0.06), 0 12px 40px rgba(61, 44, 50, 0.12);
    --font-display: "Fraunces", "Times New Roman", serif;
    --font-body: "Nunito", system-ui, sans-serif;
}

* {
    box-sizing: border-box;
}

html, body {
    margin: 0;
    min-height: 100dvh;
    background: var(--bg);
    color: var(--fg);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
}

body {
    text-align: center;
}

.hidden {
    display: none !important;
}

.page {
    max-width: 920px;
    margin: 0 auto;
    padding: 48px 20px 40px;
}

h1 {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: clamp(2rem, 6vw, 3.6rem);
    letter-spacing: -0.03em;
    margin: 8px 0 12px;
    text-wrap: balance;
}

.eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.22em;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    margin: 0;
}

.tagline, .hint, .meta, .tiny {
    color: var(--muted);
}

.tagline {
    font-size: 1.05rem;
    margin-bottom: 28px;
}

.meta {
    font-variant-numeric: tabular-nums;
    margin: 0 0 20px;
}

.hint {
    font-size: 0.9rem;
    max-width: 36rem;
    margin: 16px auto;
}

.hint.error {
    color: var(--primary);
}

.tiny {
    display: block;
    font-size: 12px;
    margin-top: 8px;
}

.btn {
    appearance: none;
    border: 0;
    border-radius: 999px;
    padding: 14px 28px;
    font-size: 16px;
    font-family: inherit;
    font-weight: 600;
    cursor: pointer;
    min-height: 44px;
}

.btn:disabled {
    opacity: 0.4;
    cursor: default;
}

.btn.primary {
    background: var(--primary);
    color: var(--primary-fg);
}

.btn.secondary {
    background: var(--surface);
    color: var(--fg);
    box-shadow: 0 0 0 1px rgba(61, 44, 50, 0.08);
}

.btn.ghost {
    background: transparent;
    color: var(--fg);
}

.btn.wide {
    width: 100%;
}

.btn:active:not(:disabled) {
    transform: scale(0.98);
}

.text-link {
    background: none;
    border: 0;
    color: var(--muted);
    font: inherit;
    cursor: pointer;
    padding: 8px;
}

.text-link:hover {
    color: var(--fg);
}

.steps {
    list-style: none;
    padding: 0;
    margin: 48px auto 0;
    display: grid;
    gap: 12px;
    max-width: 720px;
}

@media (min-width: 700px) {
    .steps {
        grid-template-columns: repeat(3, 1fr);
        text-align: left;
    }
}

.steps li {
    background: var(--surface);
    border-radius: 20px;
    padding: 16px;
    box-shadow: 0 0 0 1px rgba(61, 44, 50, 0.06);
    text-align: left;
}

.steps strong {
    display: block;
    margin-bottom: 6px;
}

.steps span {
    color: var(--muted);
    font-size: 0.92rem;
}

.home-footer {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    gap: 24px;
}

.layout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    max-width: 640px;
    margin: 28px auto 24px;
}

.layout-card {
    background: var(--surface);
    border: 0;
    border-radius: 24px;
    padding: 18px 12px 16px;
    cursor: pointer;
    font: inherit;
    color: inherit;
    box-shadow: 0 0 0 1px rgba(61, 44, 50, 0.06);
}

.layout-card:hover {
    transform: translateY(-2px);
}

.layout-name {
    display: block;
    font-weight: 600;
    margin-top: 8px;
}

.layout-meta {
    display: block;
    color: var(--muted);
    font-size: 12px;
    margin-top: 2px;
}

.mini-frame {
    display: grid;
    gap: 4px;
    width: 54px;
    margin: 0 auto 4px;
    background: var(--frame);
    padding: 6px;
    box-shadow: 0 4px 12px rgba(61, 44, 50, 0.08);
}

.mini-frame i {
    display: block;
    background: var(--slot);
    height: 10px;
}

.mini-classic { grid-template-columns: 1fr; }
.mini-grid { grid-template-columns: 1fr 1fr; width: 70px; }
.mini-grid i { height: 22px; }
.mini-polaroid { width: 48px; }
.mini-polaroid i { height: 44px; }
.mini-film { grid-template-columns: 1fr; }
.mini-film i { height: 18px; }

#frameWrap, #previewWrap {
    display: flex;
    justify-content: center;
    overflow: auto;
    padding: 8px 0 12px;
}

#photoFrame,
.preview-frame {
    background: var(--frame);
    padding: 20px;
    padding-bottom: 8px;
    box-shadow: var(--shadow);
    display: grid;
    gap: 12px;
    margin: 0 auto;
}

#photoFrame.classic,
.preview-frame.classic {
    width: 300px;
    grid-template-columns: 1fr;
}

#photoFrame.grid,
.preview-frame.grid {
    width: 352px;
    grid-template-columns: 1fr 1fr;
}

#photoFrame.polaroid,
.preview-frame.polaroid {
    width: 316px;
    padding: 18px 18px 6px;
    grid-template-columns: 1fr;
}

#photoFrame.film,
.preview-frame.film {
    width: 300px;
    grid-template-columns: 1fr;
}

.photo-slot {
    position: relative;
    overflow: hidden;
    background: var(--slot);
    height: 174px;
}

.grid .photo-slot {
    height: 150px;
}

.polaroid .photo-slot {
    height: 300px;
}

.photo-slot img,
.photo-slot video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

body > #camera,
body > #countdown {
    display: none;
}

#camera {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
}

#countdown {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-family: var(--font-display);
    font-size: 80px;
    font-weight: 500;
    z-index: 10;
    pointer-events: none;
    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
    font-variant-numeric: tabular-nums;
}

#countdown:empty {
    display: none;
}

.caption-space {
    grid-column: 1 / -1;
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}

.grid .caption-space {
    min-height: 48px;
}

.polaroid .caption-space {
    min-height: 72px;
}

.trash-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 5;
    width: 34px;
    height: 34px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: rgba(61, 44, 50, 0.55);
    color: #fff;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease, background 0.15s ease;
}

.photo-slot:hover .trash-btn,
.trash-btn:focus-visible {
    opacity: 0.75;
}

.trash-btn:hover {
    opacity: 1;
    background: rgba(196, 92, 116, 0.92);
}

@media (hover: none) {
    .trash-btn {
        opacity: 0.75;
    }
}

#photoFrame.busy .trash-btn {
    display: none;
}

.slot-msg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    font-size: 12px;
    color: var(--muted);
}

.actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 12px;
}

.sticky-actions {
    position: sticky;
    bottom: 0;
    background: color-mix(in srgb, var(--bg) 90%, white);
    padding: 16px 0 8px;
}

.customize-layout {
    display: grid;
    gap: 24px;
    margin-top: 16px;
    text-align: left;
}

@media (min-width: 900px) {
    .customize-layout {
        grid-template-columns: minmax(0, 1fr) 22rem;
        align-items: start;
    }
}

.panel {
    background: var(--surface);
    border-radius: 24px;
    padding: 20px;
    box-shadow: 0 0 0 1px rgba(61, 44, 50, 0.06);
}

fieldset {
    border: 0;
    margin: 0 0 18px;
    padding: 0;
}

legend {
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 10px;
}

.chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip {
    border: 0;
    background: var(--bg);
    color: var(--fg);
    border-radius: 999px;
    min-height: 32px;
    padding: 0 12px;
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.chip.active {
    background: var(--fg);
    color: var(--primary-fg);
}

.swatch {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 0;
    cursor: pointer;
    box-shadow: 0 0 0 1px rgba(61, 44, 50, 0.08);
}

.swatch:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.swatch.active {
    box-shadow: 0 0 0 2px var(--fg);
}

.caption-label {
    display: block;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
}

.caption-label input {
    display: block;
    width: 100%;
    margin-top: 8px;
    height: 44px;
    border: 0;
    border-radius: 12px;
    background: var(--bg);
    padding: 0 12px;
    font: inherit;
    text-transform: none;
    letter-spacing: 0;
    color: var(--fg);
}

#finalImage {
    max-width: min(100%, 420px);
    max-height: 70dvh;
    margin: 24px auto;
    display: block;
    box-shadow: var(--shadow);
}

.info-page {
    max-width: 36rem;
    text-align: left;
}

.info-page p {
    color: var(--muted);
    line-height: 1.6;
}

@media (prefers-reduced-motion: reduce) {
    * {
        transition: none !important;
        transform: none !important;
    }
}

/* =========================================================
   PASTEL HULAGWAY BACKDROP
   The cabinet intro (index.html) is intentionally untouched.
   This fixed layer sits behind every screen in booth.html.
========================================================= */

body {
    background: #f8e4ee;
}

#hulagwayBackdrop {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    isolation: isolate;
    background:
        radial-gradient(circle at 18% 19%, rgba(255, 255, 255, 0.76) 0, rgba(255,255,255,0.26) 23%, transparent 43%),
        radial-gradient(circle at 86% 72%, rgba(232, 203, 224, 0.30) 0, transparent 36%),
        linear-gradient(135deg, #fbf0f5 0%, #f7dce9 51%, #f3e2f0 100%);
}

/* Very soft pink / lavender checker, intentionally low-contrast. */
.backdrop-checker {
    position: absolute;
    inset: 0;
    opacity: 0.25;
    background-image: repeating-conic-gradient(
        rgba(221, 190, 213, 0.24) 0deg 90deg,
        rgba(255, 255, 255, 0.18) 90deg 180deg
    );
    background-size: 44px 44px;
    mix-blend-mode: multiply;
}

.backdrop-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(24px);
    pointer-events: none;
}

.backdrop-glow--one {
    width: 34vw;
    height: 34vw;
    max-width: 620px;
    max-height: 620px;
    top: -18vw;
    right: -5vw;
    background: rgba(255, 255, 255, 0.65);
}

.backdrop-glow--two {
    width: 32vw;
    height: 32vw;
    max-width: 560px;
    max-height: 560px;
    bottom: -18vw;
    left: -8vw;
    background: rgba(221, 180, 212, 0.22);
}

.backdrop-brand,
.backdrop-word {
    position: absolute;
    z-index: 1;
    font-family: var(--font-display);
    font-size: clamp(4rem, 16vw, 13rem);
    font-weight: 500;
    line-height: 0.78;
    letter-spacing: -0.045em;
    text-transform: uppercase;
    white-space: nowrap;
    user-select: none;
}

.backdrop-brand {
    top: 7vh;
    left: 3.2vw;
    color: rgba(177, 105, 132, 0.13);
}

/* Same font-size + typeface as HULAGWAY, but anchored to the right. */
.backdrop-word--photo {
    right: 2.6vw;
    bottom: -1.5vh;
    color: rgba(177, 105, 132, 0.13);
}

.backdrop-copy {
    position: absolute;
    z-index: 4;
    bottom: 4.2vh;
    color: rgba(126, 86, 99, 0.44);
    font-size: clamp(12px, 1vw, 17px);
    line-height: 1.35;
    letter-spacing: 0.02em;
    text-transform: lowercase;
}

.backdrop-copy--left {
    left: 3.2vw;
}

.backdrop-copy--right {
    right: 3.2vw;
    text-align: right;
}

.backdrop-flower {
    position: absolute;
    z-index: 2;
    pointer-events: none;
}

.backdrop-flower--right {
    top: 4.8vh;
    right: -1vw;
    width: min(56vw, 900px);
    height: 104dvh;
}

.backdrop-flower--left {
    top: 22vh;
    left: -2vw;
    width: min(29vw, 450px);
    height: 79dvh;
}

.backdrop-flower__layer {
    position: absolute;
    inset: 0;
    overflow: visible;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
}

.backdrop-flower__layer img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    object-position: center;
    user-select: none;
    -webkit-user-drag: none;
}

/* Mirroring only the left flower keeps the same artwork while making it face inward. */
.backdrop-flower--left .backdrop-flower__layer {
    transform: scaleX(-1);
}

.backdrop-flower__layer--front {
    opacity: 0.96;
    -webkit-mask-image: linear-gradient(#fff, #fff);
    mask-image: linear-gradient(#fff, #fff);
}

.backdrop-flower__layer--reveal {
    opacity: 0.98;
    -webkit-mask-image: linear-gradient(#0000, #0000);
    mask-image: linear-gradient(#0000, #0000);
}

/* Keep the actual Hulagway interface above the decorative art. */
.page {
    position: relative;
    z-index: 10;
}

@media (max-width: 1200px), (max-aspect-ratio: 4 / 5) {
    .backdrop-brand {
        top: 5.5vh;
        left: 2.7vw;
        font-size: clamp(3.5rem, 16vw, 8rem);
    }

    .backdrop-word--photo {
        font-size: clamp(3.5rem, 16vw, 8rem);
        right: 1.8vw;
        bottom: -0.7vh;
    }

    .backdrop-flower--right {
        top: 9vh;
        right: -5vw;
        width: 73vw;
        height: 75dvh;
    }

    .backdrop-flower--left {
        top: 30vh;
        left: -8vw;
        width: 38vw;
        height: 58dvh;
    }
}

@media (max-width: 700px) {
    .backdrop-brand {
        top: 5vh;
        left: 50%;
        transform: translateX(-50%);
        font-size: clamp(3rem, 16vw, 5.5rem);
    }

    .backdrop-word--photo {
        right: 2vw;
        bottom: 1vh;
        font-size: clamp(2.65rem, 15vw, 5rem);
    }

    .backdrop-flower--right {
        top: 16vh;
        right: -16vw;
        width: 96vw;
        height: 56dvh;
    }

    .backdrop-flower--left {
        top: 39vh;
        left: -17vw;
        width: 52vw;
        height: 40dvh;
    }

    .backdrop-copy {
        display: none;
    }

    .backdrop-checker {
        background-size: 30px 30px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .backdrop-flower__layer--reveal {
        opacity: 0;
    }
}


/* Responsive lily placement and spacing fixes */
#hulagwayBackdrop .backdrop-flower--left {
    top: auto;
    bottom: 0;
    left: 0.10cm;
    right: auto;
    width: min(40vw, 620px);
    height: 100dvh;
}

#hulagwayBackdrop .backdrop-flower--right {
    top: auto;
    bottom: 0;
    right: 0.10cm;
    left: auto;
    width: min(40vw, 620px);
    height: 100dvh;
}

#hulagwayBackdrop .backdrop-word--photo {
    bottom: 0.5in;
}

@media (max-width: 1200px), (max-aspect-ratio: 4 / 5) {
    #hulagwayBackdrop .backdrop-flower--left {
        top: auto;
        bottom: 0;
        left: 0.10cm;
        width: min(43vw, 520px);
        height: 78dvh;
    }

    #hulagwayBackdrop .backdrop-flower--right {
        top: auto;
        bottom: 0;
        right: 0.10cm;
        width: min(58vw, 700px);
        height: 100dvh;
    }

    #hulagwayBackdrop .backdrop-word--photo {
        bottom: 0.5in;
    }
}

@media (max-width: 700px) {
    #hulagwayBackdrop .backdrop-flower--left {
        top: auto;
        bottom: 0;
        left: 0.10cm;
        width: 48vw;
        height: 58dvh;
    }

    #hulagwayBackdrop .backdrop-flower--right {
        top: auto;
        bottom: 0;
        right: 0.10cm;
        width: 48vw;
        height: 58dvh;
    }

    #hulagwayBackdrop .backdrop-word--photo {
        bottom: 0.5in;
        right: 2vw;
    }
}


/* Final alignment adjustment: tighter side margins and lilies lowered by 1 cm */
#hulagwayBackdrop .backdrop-flower--left,
#hulagwayBackdrop .backdrop-flower--right {
    transform: translateY(1cm);
}


/* Final adjustment: move only the right lily slightly farther right. */
#hulagwayBackdrop .backdrop-flower--right {
    transform: translate(0.5cm, 1cm);
}

