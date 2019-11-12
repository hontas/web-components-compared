(function(l, r) {
  if (l.getElementById('livereloadscript')) return;
  r = l.createElement('script');
  r.async = 1;
  r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1';
  r.id = 'livereloadscript';
  l.head.appendChild(r);
})(window.document);
function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css =
  '*,*::before,*::after{box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}body{min-height:100vh;scroll-behavior:smooth;text-rendering:optimizeSpeed;line-height:1.5}ul[class],ol[class]{list-style:none}a:not([class]){text-decoration-skip-ink:auto}img{max-width:100%;display:block}article>*+*{margin-top:1em}input,button,textarea,select{font:inherit}@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;scroll-behavior:auto !important}}\n';
styleInject(css);

var css$1 =
  "body {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',\n    'Helvetica Neue', sans-serif;\n}\n";
styleInject(css$1);
//# sourceMappingURL=index.js.map
