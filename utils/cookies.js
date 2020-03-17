export const getCookie = name => {
  if (typeof document === 'undefined') {
    return;
  }

  const match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
};

export const setCookie = (name, value, days) => {
  if (typeof document === 'undefined') {
    return;
  }

  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toGMTString();
  }

  document.cookie = name + '=' + value + expires + '; path=/';
};
