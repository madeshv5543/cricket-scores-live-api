import util from 'util';
import mongoDb from '../../db/mongo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import getUser from '../getUser';
import profanityFilter from '../profanityFilter';

const addMatch = db => async event => {
    try {
        const user = getUser(event);
        const body = profanityFilter(JSON.parse(event.body));

        const result = await util.promisify(db.add)(body, user);
        db.recordUserTeams(user, [event.body.match.homeTeam, event.body.match.awayTeam]);
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = addMatch(
    process.env.IN_MEMORY ? inMemoryDb : mongoDb(process.env.MONGO_CONNECTION, () => new Date()),
);
