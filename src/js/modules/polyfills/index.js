import 'picturefill';
import objectFitImages from 'object-fit-images';
import initSvgPolyfill from './svg';
import addBling from './bling';
import extendDomElements from './extend-elements';

export default () => {
  objectFitImages();
  initSvgPolyfill();
  addBling();
  extendDomElements();
};
