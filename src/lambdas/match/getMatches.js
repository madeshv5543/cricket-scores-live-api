import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';

const getMatches = db => async event => {
    const matches = await db.getAll(event.queryStringParameters || {});

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(matches),
    };
};

exports.handler = getMatches(process.env.IN_MEMORY ? inMemoryDb : dynamo);
