import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import getUser from '../getUser';
import checkUser from '../checkUser';

const deleteMatch = db => async event => {
    try {
        const { id } = event.pathParameters;
        const getResult = await db.get(id);
        if (!getResult) {
            return {
                statusCode: 404,
                body: `match with id ${id} not found`,
            };
        }
        if (!checkUser(getUser(event), getResult.match)) {
            return {
                statusCode: 401,
            };
        }

        await db.remove(id);

        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
        };
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = deleteMatch(process.env.IN_MEMORY ? inMemoryDb : dynamo);
