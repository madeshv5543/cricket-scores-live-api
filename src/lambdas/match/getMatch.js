import util from 'util';
import mongoDb from '../../db/mongo';
import inMemoryDb from '../../db/inMemory';

const getMatch = db => async event => util.promisify(db.get)(event.id);

exports.handler = getMatch(
    process.env.IN_MEMORY ? inMemoryDb : mongoDb(process.env.MONGO_CONNECTION, () => new Date()),
);
