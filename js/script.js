const landing = document.querySelector("#landing");
const cabinet = document.querySelector("#cabinet");
const entrance = document.querySelector("#entrance");
const coinZone = document.querySelector("#coinZone");
const coinDrop = document.querySelector("#coinDrop");
const coinCursor = document.querySelector("#coinCursor");
const preview = document.querySelector("#pagePreview");

let hasStarted = false;
let timers = [];

/*
  Timing of the intro (milliseconds after the coin is inserted).
*/
const CURTAINS_OPEN_AT = 700;
const ZOOM_START_AT = 1500;
const ZOOM_DURATION = 3200; /* keep in sync with .cabinet.zoom in css/style1.css */
const GO_TO_PAGE_AT = ZOOM_START_AT + ZOOM_DURATION + 150;

/*
  Move the custom coin cursor with the mouse.
*/
window.addEventListener("mousemove", (event) => {
  if (hasStarted) return;
  coinCursor.style.left = `${event.clientX}px`;
  coinCursor.style.top = `${event.clientY}px`;
  coinCursor.style.opacity = "1";
});

/*
  Hide the coin cursor when the mouse leaves the page.
*/
document.documentElement.addEventListener("mouseleave", () => {
  coinCursor.style.opacity = "0";
});

/*
  The middle of the entrance, measured inside the cabinet
  (this is not affected by the cabinet's tilt).
*/
function entranceCenter() {
  return {
    x: entrance.offsetLeft + entrance.offsetWidth / 2,
    y: entrance.offsetTop + entrance.offsetHeight / 2,
  };
}

function viewportSize() {
  return {
    width: document.documentElement.clientWidth,
    height: window.innerHeight,
  };
}

/*
  Show the real Hulagway page (booth.html) inside the entrance.
  The page is laid out at full-screen size and shrunk to fit,
  so when the camera zooms in, it ends up exactly full screen.
*/
function fitPreview() {
  const view = viewportSize();
  const scale = Math.min(
    entrance.clientWidth / view.width,
    entrance.clientHeight / view.height
  );

  preview.style.width = `${view.width}px`;
  preview.style.height = `${view.height}px`;
  preview.style.transform = `translate(-50%, -50%) scale(${scale})`;

  return scale;
}

function setupIntro() {
  const center = entranceCenter();
  cabinet.style.transformOrigin = `${center.x}px ${center.y}px`;
  fitPreview();
}

/*
  Slowly zoom into the entrance until the Hulagway page fills the screen.
*/
function zoomIntoPage() {
  const scale = fitPreview();
  const center = entranceCenter();
  const view = viewportSize();
  const scene = cabinet.offsetParent.getBoundingClientRect();

  const centerX = scene.left + cabinet.offsetLeft + center.x;
  const centerY = scene.top + cabinet.offsetTop + center.y;

  const moveX = view.width / 2 - centerX;
  const moveY = view.height / 2 - centerY;

  cabinet.style.transformOrigin = `${center.x}px ${center.y}px`;
  cabinet.classList.add("zoom");
  cabinet.style.transform =
    `translate(${moveX}px, ${moveY}px) rotateY(0deg) rotateX(0deg) scale(${1 / scale})`;
}

/*
  Start the intro animation.
*/
function insertCoin() {
  if (hasStarted) return;

  hasStarted = true;
  coinCursor.style.opacity = "0";

  /*
    Restart the coin-drop animation.
    This allows the animation to work reliably.
  */
  coinDrop.classList.remove("dropping");
  void coinDrop.offsetWidth;
  coinDrop.classList.add("dropping");

  /*
    1. The curtains open and the Hulagway page appears.
  */
  timers.push(
    setTimeout(() => {
      entrance.classList.add("curtains-open");
      landing.classList.add("zooming");
    }, CURTAINS_OPEN_AT)
  );

  /*
    2. Slowly zoom into the Hulagway page.
  */
  timers.push(setTimeout(zoomIntoPage, ZOOM_START_AT));

  /*
    3. Go to the real page. It looks exactly the same as the zoomed view.
  */
  timers.push(
    setTimeout(() => {
      window.location.href = "booth.html";
    }, GO_TO_PAGE_AT)
  );
}

/*
  Put the intro back to the start
  (for example when the browser's Back button returns to this page).
*/
function resetIntro() {
  timers.forEach(clearTimeout);
  timers = [];
  hasStarted = false;

  cabinet.style.transition = "none";
  cabinet.classList.remove("zoom");
  cabinet.style.transform = "";
  landing.classList.remove("zooming");
  entrance.classList.remove("curtains-open");
  coinDrop.classList.remove("dropping");

  setupIntro();
  void cabinet.offsetWidth;
  cabinet.style.transition = "";
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted) resetIntro();
});

window.addEventListener("resize", () => {
  if (!hasStarted) setupIntro();
});

setupIntro();
window.addEventListener("load", () => {
  if (!hasStarted) setupIntro();
});
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    if (!hasStarted) setupIntro();
  });
}

/*
  Desktop:
  Start when the mouse click over the coin slot.
*/
coinZone.addEventListener("click", insertCoin);

/*
  Mobile and desktop:
  Start when the coin slot is clicked or tapped.
*/
coinZone.addEventListener("click", insertCoin);
