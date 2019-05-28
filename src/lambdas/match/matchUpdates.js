import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import sendUpdates from '../sendUpdates';

const matchUpdate = db => async event => {
    try {
        const updates = sendUpdates(db);

        const updateMatch = async rec => {
            const { user, add, updated } = JSON.parse(rec.Sns.Message);
            if (add) {
                await Promise.all([
                    db.recordUserTeams(user, [add.match.homeTeam, add.match.awayTeam]),
                    updates.matchAdd(add),
                ]);
            } else if (updated) {
                await updates.matchUpdate(updated);
            }
        };
        await Promise.all(event.Records.map(updateMatch));

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = matchUpdate(process.env.IN_MEMORY ? inMemoryDb : dynamo);
