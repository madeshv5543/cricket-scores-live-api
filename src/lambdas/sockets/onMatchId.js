import inMemoryDb from '../../db/inMemory';
import dynamoDb from '../../db/dynamo';

const onMatchId = db => async event => {
    try {
        const matchId = JSON.parse(event.body).matchId;
        await db.setMatchIds(event.requestContext.connectionId, [matchId]);
        return {
            statusCode: 200,
            body: 'Updated',
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err.stack,
        };
    }
};

export default onMatchId(process.env.IN_MEMORY ? inMemoryDb : dynamoDb);
