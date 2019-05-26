import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import getUser from '../getUser';
import checkUser from '../checkUser';
import profanityFilter from '../profanityFilter';

const putMatch = db => async event => {
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
        const body = profanityFilter(JSON.parse(event.body));
        const result = await db.update(id, body);

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = putMatch(process.env.IN_MEMORY ? inMemoryDb : dynamo);
