function sendToAria2(downloadUrl, secret = 'ariaisabitch') {
    const aria2Url = 'http://localhost:6800/jsonrpc';

    const jsonPayload = JSON.stringify({
        'jsonrpc': '2.0',
        'id': 'qwer',
        'method': 'aria2.addUri',
        'params': ['token:' + secret, [downloadUrl]]
    });

    fetch(aria2Url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonPayload
    })
    .then(response => response.json())
    .then(data => console.log('Aria2 response:', data))
    .catch(error => console.error('Error:', error));
}