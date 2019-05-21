import util from 'util';
import mongoDb from '../../db/mongo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import getUser from '../getUser';
import checkUser from '../checkUser';

const putMatch = db => async event => {
    try {
        const { id } = event.pathParameters;
        console.log(event);
        const getResult = await util.promisify(db.get)(id);
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
        const result = await util.promisify(db.update)(event.params.id, event.body);
        updates.matchUpdated(event.body);

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = putMatch(
    process.env.IN_MEMORY ? inMemoryDb : mongoDb(process.env.MONGO_CONNECTION, () => new Date()),
);
