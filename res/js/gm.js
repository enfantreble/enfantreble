// Intercept XHR requests to extract JSON responses based on a URL fragment
// @version      0.4.5
function interceptXHR(url_fragment) {
    if (window._xhrIntercepted) return;

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._url = url; // Track the request URL
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        const promise = new Promise((resolve, reject) => {
            this.addEventListener('load', function () {
                if (this._url.includes(url_fragment)) {
                    console.log('Intercepted request:', this._url);
                    try {
                        const jsonResponse = JSON.parse(this.responseText);
                        resolve(jsonResponse); // Resolve the promise with the parsed JSON response
                    } catch (e) {
                        console.error('Failed to parse JSON:', e);
                        reject(e); // Reject the promise on error
                    }
                } else {
                    resolve(null); // Resolve with null if the URL doesn't match
                }
            });
        });

        return originalSend.apply(this, arguments), promise; // Return the promise
    };
    window._xhrIntercepted = true;
}
