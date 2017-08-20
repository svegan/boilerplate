import {addPolyfills} from './modules/polyfills';
import {initPieChart} from './modules';

const init = () => {
  addPolyfills();
  initPieChart();
};

document.addEventListener('DOMContentLoaded', init);
