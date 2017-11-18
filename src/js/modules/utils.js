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
