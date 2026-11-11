// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  //get the query string part of the current URL
  const queryString = window.location.search;
  //create URLSearchParams object
  const urlParams = new URLSearchParams(queryString);
  //retrieves value of named parameter
  const product = urlParams.get(param);
  return product;
}

//receive 5 arguments: templateFn, parentElement, list, position, clear
//often afterbegin will be the position you want to insert into, often don't want to clear contents; set default values
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStringObj = list.map(templateFn);

  //add logic to clear out element provided if clear is true
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStringObj.join(""));
}