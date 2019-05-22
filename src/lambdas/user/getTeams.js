import util from 'util';
import mongoDb from '../../db/mongo';
import inMemoryDb from '../../db/inMemory';
import getUser from '../getUser';

const getMatches = db => async event => {
    const teams = await util.promisify(db.getUserTeams)(getUser(event));

    return {
        statusCode: 200,
        body: JSON.stringify(teams),
    };
};

exports.handler = getMatches(
    process.env.IN_MEMORY ? inMemoryDb : mongoDb(process.env.MONGO_CONNECTION, () => new Date()),
);
