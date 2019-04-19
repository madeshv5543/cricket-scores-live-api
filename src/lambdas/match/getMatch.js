import util from 'util';
import mongoDb from '../../db/mongo';
import inMemoryDb from '../../db/inMemory';

const getMatch = db => async event => {
    const id = event.pathParameters.id;
    const match = await util.promisify(db.get)(id);

    if (!match) {
        return {
            statusCode: 404,
            body: JSON.stringify(`Match with id ${id} does not exist`),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(match),
    };
};

exports.handler = getMatch(
    process.env.IN_MEMORY ? inMemoryDb : mongoDb(process.env.MONGO_CONNECTION, () => new Date()),
);
