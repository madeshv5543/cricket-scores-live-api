import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';

const getMatch = db => async event => {
    const { id } = event.pathParameters;
    const match = await db.get(id);

    if (!match) {
        return {
            statusCode: 404,
            body: JSON.stringify(`Match with id ${id} does not exist`),
        };
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(match),
    };
};

exports.handler = getMatch(process.env.IN_MEMORY ? inMemoryDb : dynamo);
