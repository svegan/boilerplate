const addBling = () => {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  Node.prototype.on = window.on = function (name, fn) {
    this.addEventListener(name, fn);
  };

  Node.prototype.off = window.off = function (name, fn) {
    this.removeEventListener(name, fn);
  };

  // Disabled due to using core-js
  // NodeList.prototype.__proto__ = Array.prototype; // eslint-disable-line

  NodeList.prototype.on = function (name, fn) {
    this.forEach((elem) => elem.on(name, fn));
  };

  NodeList.prototype.off = function (name, fn) {
    this.forEach((elem) => elem.off(name, fn));
  };

  return {$, $$};
};

const {$, $$} = addBling();

export {$, $$};
