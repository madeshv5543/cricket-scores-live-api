import inMemoryDb from '../../db/inMemory';
import dynamoDb from '../../db/dynamo';

const onDisconnect = db => async event => {
    try {
        await db.removeConnection(event.requestContext.connectionId);
        return {
            statusCode: 200,
            body: 'Disonnected',
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err.stack,
        };
    }
};

export default onDisconnect(process.env.IN_MEMORY ? inMemoryDb : dynamoDb);
