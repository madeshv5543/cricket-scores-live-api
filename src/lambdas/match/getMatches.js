import util from 'util';
import mongoDb from '../../db/mongo';
import inMemoryDb from '../../db/inMemory';

const getMatches = db => async event => {
    const matches = await util.promisify(db.getAll)(event.query);

    return {
        statusCode: 200,
        body: JSON.stringify(matches),
    };
};

exports.handler = getMatches(
    process.env.IN_MEMORY ? inMemoryDb : mongoDb(process.env.MONGO_CONNECTION, () => new Date()),
);
