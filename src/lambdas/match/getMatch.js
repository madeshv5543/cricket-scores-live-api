import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import withCorsHeaders from '../withCorsHeaders';

const getMatch = db => async event => {
    const { id } = event.pathParameters;
    const match = await db.get(id);

    if (!match) {
        return {
            statusCode: 404,
            body: JSON.stringify(`Match with id ${id} does not exist`),
        };
    }

    return withCorsHeaders({
        statusCode: 200,
        body: JSON.stringify(match),
    });
};

exports.handler = getMatch(process.env.IN_MEMORY ? inMemoryDb : dynamo);
