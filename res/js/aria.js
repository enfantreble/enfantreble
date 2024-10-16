// @version      0.4.5
function sendToAria2(mediaEntries, secret = 'ariaisabitch') {
    mediaEntries.forEach(({ url, filename, username }) => {
        console.log(`Sending URL to Aria2: ${url}`);
    const aria2Url = 'http://localhost:6800/jsonrpc';

    // Define the download directory based on the username
    const downloadDirectory = `/downloads/${username}`;

    const jsonPayload = JSON.stringify({
        'jsonrpc': '2.0',
        'id': 'qwer',
        'method': 'aria2.addUri',
        'params': [
            'token:' + secret,
                [url],
            { 'out': filename, 'dir': downloadDirectory } // Use filename and directory
        ]
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
            alert(`Sent to Aria2: ${filename} in ${downloadDirectory}`);
        },
        onerror: function(error) {
            console.error('Failed to send to Aria2:', error);
            alert('Failed to send URL to Aria2');
        }
    });
    });
}
