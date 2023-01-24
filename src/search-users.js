import { fromEvent, EMPTY } from "rxjs";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  tap,
  catchError,
  filter,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

const BASE_URL = "https://api.github.com/search/users?q=";

const input = document.getElementById("search_input");
const pastle = document.getElementById("cards_row");

export function searchUsers() {
  // второй параметр ==> название события
  const stream$ = fromEvent(input, "input").pipe(
    map((event) => event.target.value),
    debounceTime(1500), //задержка ==> есть из коробки
    distinctUntilChanged(), //проверка на неизмененность вводимых данных для избежания повторных запросов
    tap(() => (pastle.innerHTML = "")), //очищаем перед следующим запросом
    filter((value) => value.trim()), // если в инпуте будет пустая строка, то filter не пропустит стрим дальше и запрос не отправиться
    switchMap(
      (val) =>
        ajax
          .getJSON(BASE_URL + val) //переключение на другой стрим, значение попадает из инпута
          .pipe(catchError((err) => EMPTY)) // обработка ошибок ajax запросов
    ),
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
                          <a href=${user.html_url} class="teal-text" target="blanc">Go to profile</a>
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
}
