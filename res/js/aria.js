function sendToAria2(downloadUrl, secret = 'ariaisabitch') {
    const aria2Url = 'http://localhost:6800/jsonrpc';
    console.log('aria call');
    const jsonPayload = JSON.stringify({
        'jsonrpc': '2.0',
        'id': 'qwer',
        'method': 'aria2.addUri',
        'params': ['token:' + secret, [downloadUrl]]
    });

    GM_xmlhttpRequest({
        method: 'POST',
        url: aria2Url,
        headers: {
            'Content-Type': 'application/json'
        },
        data: jsonPayload,
        onload: function(response) {
            const jsonResponse = JSON.parse(response.responseText);
            console.log('Aria2 response:', jsonResponse);
        },
        onerror: function(error) {
            console.error('Error:', error);
        }
    });
}

// Example usage: pass the URL to the function
// sendToAria2("http://example.com/file-to-download");
