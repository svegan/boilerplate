const addClosestMethod = () => {
  (function(ELEMENT) {
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

const extendHTMLCollection = () => {
  // Triggering in core.js, or switch on here manually.
  // HTMLCollection.prototype[Symbol.iterator] = Array.prototype.values;
};

const extendHTMLElement = () => {
  HTMLElement.prototype.appendFirst = function(childNode) {
    if (this.firstChild) {
      this.insertBefore(childNode, this.firstChild);
    } else {
      this.appendChild(childNode);
    }
  };
};

export const addPolyfills = () => {
  addClosestMethod();
  extendHTMLCollection();
  extendHTMLElement();
};
