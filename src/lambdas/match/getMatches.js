import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import withCorsHeaders from '../withCorsHeaders';
import handleError from '../handleError';
import toLowerCaseProps from '../toLowerCaseProps';

const getMatches = db => async event => {
    try {
        const matches = await db.getAll(toLowerCaseProps(event.queryStringParameters || {}));

        return withCorsHeaders({
            statusCode: 200,
            body: JSON.stringify(matches),
        });
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = getMatches(process.env.IN_MEMORY ? inMemoryDb : dynamo);
