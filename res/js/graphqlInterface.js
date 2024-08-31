// graphqlInterface.js
const API_URL = 'http://localhost:9000/graphql';

async function findPerformer(performerName) {
    const query = `
        query {
            findPerformers(filter: {per_page: 10, page: 1}, performer_filter: {}, q: "${performerName}") {
                performers {
                    id
                    name
                    disambiguation
                    alias_list
                }
            }
        }
    `;
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });

    const data = await response.json();
    return data.data.findPerformers.performers;
}

async function createPerformer(performerDetails) {
    const mutation = `
        mutation {
            performerCreate(input: {name: "${performerDetails.name}"}) {
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
    return data.data.performerCreate;
}
