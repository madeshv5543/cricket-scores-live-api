import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import getUser from '../getUser';
import profanityFilter from '../profanityFilter';

const addMatch = db => async event => {
    try {
        const user = getUser(event);
        const body = profanityFilter(JSON.parse(event.body));
        const result = await db.add(body, user);
        await db.recordUserTeams(user, [body.match.homeTeam, body.match.awayTeam]);

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = addMatch(process.env.IN_MEMORY ? inMemoryDb : dynamo);
