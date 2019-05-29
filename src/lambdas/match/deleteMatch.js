import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import getUser from '../getUser';
import checkUser from '../checkUser';
import withCorsHeaders from '../withCorsHeaders';

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

        return withCorsHeaders({
            statusCode: 204,
        });
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = deleteMatch(process.env.IN_MEMORY ? inMemoryDb : dynamo);
