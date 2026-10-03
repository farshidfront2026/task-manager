const today = new Date();
const formatter = new Intl.DateTimeFormat("fa-IR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const parts = formatter.formatToParts(today);
let weekday = "",
  day = "",
  month = "",
  year = "";

parts.forEach((part) => {
  if (part.type === "weekday") weekday = part.value;
  if (part.type === "day") day = part.value;
  if (part.type === "month") month = part.value;
  if (part.type === "year") year = part.value;
});

const formattedDate = `امروز، ${weekday}، ${day} ${month} ${year}`;

// 1.Update date element on desktop view
const desktopDateElement = document.getElementById("desktop-date");
if (desktopDateElement) {
  desktopDateElement.textContent = formattedDate;
}

// 2.Update date element on mobile view
const mobileDateElement = document.getElementById("mobile-date");
if (mobileDateElement) {
  mobileDateElement.textContent = formattedDate;
}
