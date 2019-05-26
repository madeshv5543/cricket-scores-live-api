import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';

const getMatches = db => async event => {
    const matches = await db.getAll(event.queryStringParameters || {});

    return {
        statusCode: 200,
        body: JSON.stringify(matches),
    };
};

exports.handler = getMatches(process.env.IN_MEMORY ? inMemoryDb : dynamo);
