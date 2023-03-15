// Usage:

// Place the following code where you want the form to appear:
//
// <div id="agencyPartnerForm"></div>
// <script type="text/javascript" src="https://www.datocms.com/landing-pages/agencyPartnerForm.js"></script>

(() => {
  document.getElementById(
    'agencyPartnerForm',
  ).innerHTML = `<iframe src="https://www.datocms.com/partner-program/form" id="agencyPartnerForm" frameBorder="0" style="width: 100%;"></iframe>`;

  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute(
    'src',
    'https://unpkg.com/iframe-resizer@4.3.6/js/iframeResizer.min.js',
  );
  script.addEventListener('load', () => {
    iFrameResize({ log: false }, '#agencyPartnerForm');
  });
  document.getElementsByTagName('head')[0].appendChild(script);
})();
