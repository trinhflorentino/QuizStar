(function () {
  var redirectTarget = '/';

  function resolveRedirect() {
    // Resolve the login page URL and avoid falling back to about:blank/popups
    var origin = window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : '';

    // Prefer absolute path to avoid base-path edge cases in dev server
    if (redirectTarget.charAt(0) === '/') {
      return (origin || '') + redirectTarget;
    }

    try {
      var resolvedUrl = new URL(redirectTarget, window.location.href).href;
      if (!resolvedUrl.startsWith('about:')) {
        return resolvedUrl;
      }
    } catch (err) {
      // fall through to manual build
    }

    // Manual fallback: stick to same origin + root to prevent about:blank
    return (origin || '') + '/' + redirectTarget.replace(/^\//, '');
  }

  function redirectToLogin() {
    window.location.href = resolveRedirect();
  }

  // Keep signOut available globally
  window.signOut = function signOut() {
    loadingAnimation.show('Dang dang xu?t...');
    setTimeout(function () {
      auth.signOut();
      localStorage.removeItem('iduser');
      localStorage.removeItem('name');
      redirectToLogin();
    }, 0xbb8);
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      localStorage.setItem('iduser', user.uid);
      return;
    }
    redirectToLogin();
  });
})();
