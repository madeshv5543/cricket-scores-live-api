import inMemoryDb from '../../db/inMemory';
import dynamoDb from '../../db/dynamo';

const onMatchIds = db => async event => {
    try {
        await db.setMatchId(event.requestContext.connectionId, '-');
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

export default onMatchIds(process.env.IN_MEMORY ? inMemoryDb : dynamoDb);
