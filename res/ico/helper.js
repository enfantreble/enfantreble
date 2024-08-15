// Function to create and display the status panel
function createStatusPanel() {
    const statusPanel = document.createElement('div');
    statusPanel.id = 'statusPanel';
    statusPanel.style.position = 'fixed';
    statusPanel.style.top = '2vh';
    statusPanel.style.right = '2vw';
    statusPanel.style.width = 'calc(20vw - 4px)';
    statusPanel.style.height = 'calc(45vh - 4px)';
    statusPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    statusPanel.style.color = 'white';
    statusPanel.style.border = '2px solid white';
    statusPanel.style.overflowY = 'scroll';
    statusPanel.style.zIndex = '9999';
    statusPanel.style.padding = '10px';
    statusPanel.innerHTML = '<h2>Status Panel</h2><div id="statusLog"></div>';
    document.body.appendChild(statusPanel);
}

function logStatus(message) {
    const statusLog = document.getElementById('statusLog');
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    statusLog.appendChild(logEntry);
    statusLog.scrollTop = statusLog.scrollHeight;
}

// Function to wait for an element to be ready
function elementReady(selector) {
    return new Promise((resolve, reject) => {
        let el = document.querySelector(selector);
        if (el) { resolve(el); }
        new MutationObserver((mutationRecords, observer) => {
            Array.from(document.querySelectorAll(selector)).forEach((element) => {
                resolve(element);
                observer.disconnect();
            });
        })
            .observe(document.documentElement, {
                childList: true,
                subtree: true
            });
    });
}
