import { fromEvent } from "rxjs";
import { tap } from "rxjs/operators";

const toggle = document.getElementById("switch");
const theme = document.getElementById("theme");

export function toggleTheme() {
  let isThemeDark = localStorage.getItem("theme");
  const props = isThemeDark === "true" ? "black" : "white";
  document.documentElement.style.setProperty("background-color", props);
  const textColor = localStorage.getItem("textColor");
  theme.textContent = textColor === "#84c7c1" ? "Dark side" : "Light side";
  document.documentElement.style.setProperty("color", textColor);

  console.log(textColor);

  if (isThemeDark === "true") {
    toggle.checked = isThemeDark;
  }

  fromEvent(toggle, "change")
    .pipe(tap((value) => {}))
    .subscribe((value) => {
      if (value.target.checked) {
        console.log("Dark Used");
        document.documentElement.style.setProperty("background-color", "black");
        document.documentElement.style.setProperty("color", "#84c7c1");
        theme.textContent = "Dark side";
        localStorage.setItem("theme", "true");
        localStorage.setItem("textColor", "#84c7c1");
      } else {
        console.log("Light Used");
        document.documentElement.style.setProperty("background-color", "white");
        document.documentElement.style.setProperty("color", "#9e9e9e");
        theme.textContent = "Light side";
        localStorage.setItem("theme", "false");
        localStorage.setItem("textColor", "#9e9e9e");
      }
    });
}
