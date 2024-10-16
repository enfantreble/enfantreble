/**
 * Process Instagram JSON to extract the largest media URLs and relevant metadata.
 * @param {Object} jsonData - The Instagram JSON data.
 * @returns {Array} - An array of media objects with URL, filename, and username.
 */
function processJsonInstagram(jsonData) {
    const mediaItems = [];

    if (
        jsonData.data &&
        jsonData.data.xdt_api__v1__feed__timeline__connection &&
        Array.isArray(jsonData.data.xdt_api__v1__feed__timeline__connection.edges)
    ) {
        const edges = jsonData.data.xdt_api__v1__feed__timeline__connection.edges;

        const username = edges[0]?.node?.user?.username || 'unknown_user'; // Extract username

        edges.forEach(edge => {
            const media = edge.node.media;
            const mediaId = media.id; // Unique media ID
            const timestamp = media.taken_at || Date.now(); // Get timestamp or current time

            if (media.image_versions2?.candidates) {
                // Pick the largest resolution version
                const largestVersion = media.image_versions2.candidates.reduce((max, candidate) =>
                    candidate.width * candidate.height > max.width * max.height ? candidate : max
                );

                const mediaUrl = largestVersion.url;
                const formattedTimestamp = formatTimestamp(timestamp); // Format the timestamp
                const filename = `${formattedTimestamp}_${mediaId}.jpg`; // Construct the filename

                mediaItems.push({ url: mediaUrl, filename, username }); // Collect media data
            }
        });
    }

    return mediaItems; // Return the extracted media items
}


