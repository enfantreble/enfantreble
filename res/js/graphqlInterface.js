const API_URL = 'http://localhost:9000/graphql';

async function findPerformer(name) {
    const query = `
        query FindPerformers($q: String!) {
            findPerformers(filter: {per_page: 10, page: 1}, performer_filter: {}, q: $q) {
                performers {
                    id
                    name
                    disambiguation
                    alias_list
                }
            }
        }
    `;
    const variables = { q: name };
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    });
    const data = await response.json();
    return data.data.findPerformers.performers;
}

async function createPerformer(performerDetails) {
    const mutation = `
        mutation CreatePerformer($input: PerformerCreateInput!) {
            performerCreate(input: $input) {
                id
                name
                disambiguation
                alias_list
            }
        }
    `;
    const variables = { input: performerDetails };
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation, variables }),
    });
    const data = await response.json();
    return data.data.performerCreate;
}

console.log("GraphQL Interface script loaded.");
