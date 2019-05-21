import util from 'util';
import mongoDb from '../../db/mongo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import getUser from '../getUser';
import checkUser from '../checkUser';

const deleteMatch = db => async event => {
    try {
        const { id } = event.pathParameters;
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

        await util.promisify(db.remove)(req.params.id);

        return {
            statusCode: 204,
        };
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = deleteMatch(
    process.env.IN_MEMORY ? inMemoryDb : mongoDb(process.env.MONGO_CONNECTION, () => new Date()),
);
