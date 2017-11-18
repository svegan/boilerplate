import {$, $$} from './polyfills';

export {$, $$};

export const uploadForm = (form, success, fail) => {
  const formData = {};
  const elements = Array.prototype.slice.call(form.elements);
  for (let element of elements) {
    if (element.type === 'submit') {
      continue;
    }
    formData[element.name] = element.value;
  }
  const requestString = Object.keys(formData).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
  }).join('&');

  return window.fetch(form.action, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: requestString
  })
      .then((response) => {
        if (response.ok) {
          return;
        } else {
          throw new Error('Answer error');
        }
      })
      .then(success)
      .catch(fail);
};

export const throttle = (fn, threshhold = 250, context = null) => {
  let last;
  let deferTimer;
  return () => {
    let now = +new Date();
    let args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};

export const colorLuminance = (hex, lum) => {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  let rgb = '#';
  let c;

  for (let i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }

  return rgb;
};

export const capitalizeFirstLetter = (string) => (
  string.charAt(0).toUpperCase() + string.slice(1)
);

export const isMobile = () => document.documentElement.clientWidth <= 768;
export const isTablet = () => document.documentElement.clientWidth <= 1024;
