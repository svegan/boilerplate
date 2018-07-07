export default () => {
  Node.prototype.on = window.on = function (name, fn) {
    this.addEventListener(name, fn);
  };

  Node.prototype.off = window.off = function (name, fn) {
    this.removeEventListener(name, fn);
  };

  NodeList.prototype.on = function (name, fn) {
    this.forEach((elem) => elem.on(name, fn));
  };

  NodeList.prototype.off = function (name, fn) {
    this.forEach((elem) => elem.off(name, fn));
  };
};
