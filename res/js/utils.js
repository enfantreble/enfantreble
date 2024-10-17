/**
 * Helper function to format a Unix timestamp to 'YYYYMMdd_HHmmss'.
 * @param {number} timestamp - The Unix timestamp (in seconds).
 * @returns {string} - The formatted timestamp as 'YYYYMMdd_HHmmss'.
 */
// @version      0.4.5
function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}_${hours}${minutes}${seconds}`; // Format: YYYYMMdd_HHmmss
}

function stripToDomain(url) {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?([^\/]+).*/, '$1');
}


function createElement() {
    var newHTML = document.createElement('div');
    newHTML.innerHTML = `<div>${html}}</div>`
    document.body.appendChild(newHTML);
}



module.exports = { formatTimestamp, stripToDomain,createElement };
