import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import withCorsHeaders from '../withCorsHeaders';
import handleError from '../handleError';

const getMatches = db => async event => {
    console.log(event);
    try {
        const matches = await db.getAll(event.queryStringParameters || {});

        return withCorsHeaders({
            statusCode: 200,
            body: JSON.stringify(matches),
        });
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = getMatches(process.env.IN_MEMORY ? inMemoryDb : dynamo);
