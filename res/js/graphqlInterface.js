// graphqlInterface.js
(async function() {
    const API_URL = 'http://localhost:9000/graphql';

    async function createPerformer(performerName) {
        const mutation = `
            mutation {
                performerCreate(input: {name: "${performerName}"}) {
                    id
                    name
                }
            }
        `;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: mutation })
        });

        const data = await response.json();
        return data;
    }

    // Expose the function to the global scope
    window.createPerformer = createPerformer;
})();
