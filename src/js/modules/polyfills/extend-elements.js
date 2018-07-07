import iterator from 'core-js/fn/array/iterator';

const addClosestMethod = () => {
  (function (ELEMENT) {
    ELEMENT.matches =
      ELEMENT.matches ||
      ELEMENT.mozMatchesSelector ||
      ELEMENT.msMatchesSelector ||
      ELEMENT.oMatchesSelector ||
      ELEMENT.webkitMatchesSelector;
    ELEMENT.closest =
      ELEMENT.closest ||
      function closest(selector) {
        if (!this) {
          return null;
        }
        if (this.matches(selector)) {
          return this;
        }
        if (!this.parentElement) {
          return null;
        }
        return this.parentElement.closest(selector);
      };
  })(Element.prototype);
};

const addAppendFirstMethod = () => {
  HTMLElement.prototype.appendFirst = function(childNode) {
    if (this.firstChild) {
      this.insertBefore(childNode, this.firstChild);
    } else {
      this.appendChild(childNode);
    }
  };
};

const extendHTMLCollection = () => {
  // Switched off in core.js
  HTMLCollection.prototype[Symbol.iterator] = iterator;
};

export default () => {
  addClosestMethod();
  addAppendFirstMethod();
  extendHTMLCollection();
};
