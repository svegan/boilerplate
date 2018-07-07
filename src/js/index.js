import 'core-js/es6/symbol';
import 'core-js/es6/promise';
import 'core-js/web/dom-collections';
import { addPolyfills } from './modules';

const init = () => {
  addPolyfills();
};

document.addEventListener('DOMContentLoaded', init);
