function fetchWithRetry(url, options, retries, delay, onSuccess, onError) {
    let currentRetry = 0;
    function makeRequest() {
        fetch(url, options) // Standard fetch
        .then(response => {
            if (response.ok) {
                onSuccess(response);
            } else {
                handleRetry(response.status);
            }
        })
        .catch(error => handleRetry(error));
    }
    function handleRetry(error) {
        console.error(`Attempt ${currentRetry + 1} failed:`, error);
        if (currentRetry < retries - 1) {
            currentRetry++;
            setTimeout(makeRequest, delay);
        } else {
            onError(new Error(`Failed to fetch after ${retries} retries`));
        }
    }
    makeRequest();
}

function sendToAria2(aria2Token, url, filename, directory, retries = 3, delay = 1000, onSuccess, onError) {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": "qwer",
            "method": "aria2.addUri",
            "params": [
                `token:${aria2Token}`, // Token is included
                [url],
                {
                    "out": filename,
                    "dir": directory
                }
            ]
        })
    };
    
    fetchWithRetry('http://localhost:16800/jsonrpc', options, retries, delay, onSuccess, onError);
};
