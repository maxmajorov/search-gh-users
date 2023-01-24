import { fromEvent, interval } from "rxjs";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  tap,
  scan,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

const BASE_URL = "https://api.github.com/search/users?q=";

const toggle = document.getElementById("switch");
const input = document.getElementById("search_input");
const pastle = document.getElementById("cards_row");
const theme = document.getElementById("theme");
const body = document.body;

// второй параметр ==> название события
const stream$ = fromEvent(input, "input").pipe(
  map((event) => event.target.value),
  debounceTime(1000), //задержка ==> есть из коробки
  distinctUntilChanged(), //проверка на неизмененность вводимых данных для избежания повторных запросов
  tap(() => (pastle.innerHTML = "")), //очищаем перед следующим запросом
  switchMap((val) => ajax.getJSON(BASE_URL + val)), //переключение на другой стрим, значение попадает из инпута
  map((response) => response.items), // получим массив с данными пользователя(лей)
  mergeMap((item) => item) //можем возвращать не массивом а отдельным элементом
);

const showUserData = (user) => {
  return `
        <div class="col s4">
                <div class="card">
                    <div class="card-image">
                        <img src=${user.avatar_url}/>
                        <span class="card-title">${user.login}</span>
                    </div>
                    <div class="card-action">
                        <a href=${user.html_url} class="teal-text">Go to profile</a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

stream$.subscribe((value) => {
  const html = showUserData(value);
  pastle.insertAdjacentHTML("beforeend", html);
}); //получим объект с данными по профилю

// change themes
let isThemeDark = localStorage.getItem("theme");
const props = isThemeDark === "true" ? "black" : "white";
document.documentElement.style.setProperty("background-color", props);
const textColor = localStorage.getItem("textColor");
theme.textContent = textColor === "#84c7c1" ? "Dark side" : "Light side";
// theme.style.setProperty("color", textColor);
document.documentElement.style.setProperty("color", textColor);

console.log(textColor);

if (isThemeDark === "true") {
  toggle.checked = isThemeDark;
}

const steamTheme$ = fromEvent(toggle, "change")
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
