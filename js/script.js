const landing = document.querySelector("#landing");
const cabinet = document.querySelector("#cabinet");
const entrance = document.querySelector("#entrance");
const coinZone = document.querySelector("#coinZone");
const coinDrop = document.querySelector("#coinDrop");
const coinCursor = document.querySelector("#coinCursor");

let hasStarted = false;

/*
  Move the custom coin cursor with the mouse.
*/
window.addEventListener("mousemove", (event) => {
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
  Start the intro animation.
*/
function insertCoin() {
  if (hasStarted) return;

  hasStarted = true;

  /*
    Restart the coin-drop animation.
    This allows the animation to work reliably.
  */
  coinDrop.classList.remove("dropping");
  void coinDrop.offsetWidth;
  coinDrop.classList.add("dropping");

  /*
    Open the curtains and zoom into the booth
    after the coin has dropped.
  */
  setTimeout(() => {
    entrance.classList.add("curtains-open");
    landing.classList.add("zooming");
    cabinet.classList.add("zoom");
  }, 700);

  /*
    Go to the photo booth page after the animation.
    Change this filename to your real next page.
  */
  setTimeout(() => {
    window.location.href = "booth.html";
  }, 2600);
}

/*
  Desktop:
  Start when the mouse hovers over the coin slot.
*/
coinZone.addEventListener("mouseenter", insertCoin);

/*
  Mobile and desktop:
  Start when the coin slot is clicked or tapped.
*/
coinZone.addEventListener("click", insertCoin);
