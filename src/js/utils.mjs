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

const quesryString = window.location.search;
const urlParaams = new URLSearchParams(quesryString);
const product = urlurlParaams.get('product')

export function renderListWithTemplate
(templateFn, 
  parentElement, list, position="afterbegin",clear=false){
  if(clear){
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  paraentElement.insertAdjacentHTML(position, htmlStrings.join(""));
 
    
  }

  export function renderWithTemplate
(template,
 parentElement,
 data,
callback){
      parentElement.innerHTML = template;

  if(callback){
    callback(data);
  }
  const htmlStrings = list.map(templateFn);
  paraentElement.insertAdjacentHTML(position, htmlStrings.join(""));
  }
  async function loadTemplate(url){
    const response = await fetch(url);
    const template = await response.text();
    return template;
  }
  export async function loadHeaderFooter(){
    const headerTemplate = await loadTemplate("/partials/header.html");
    const headerelement = document.getElementById("header");
    renderWithTemplate(headerTemplate, headerelement);

    const footerTemplate = await loadTemplate("/partials/footer.html");
    const footerelement = document.getElementById("footer");
    renderWithTemplate(footerTemplate, footerelement);
  }