var iframe = document.createElement('iframe');
iframe.src = 'https://www.datocms.com/partner-program/form';
iframe.border = 0;
iframe.id = 'partnerProgramForm';
iframe.style = 'width: 100%';
document.body.appendChild(iframe);

const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute(
  'src',
  'https://unpkg.com/iframe-resizer@4.3.6/js/iframeResizer.min.js',
);
script.addEventListener('load', () => {
  iFrameResize({ log: false }, '#partnerProgramForm');
});
document.getElementsByTagName('head')[0].appendChild(script);
