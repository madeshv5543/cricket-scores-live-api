import inMemoryDb from '../../db/inMemory';
import dynamoDb from '../../db/dynamo';

const onConnect = db => async event => {
    try {
        await db.addConnection(
            event.requestContext.connectionId,
            `${event.requestContext.domainName}/${event.requestContext.stage}`,
        );
        return {
            statusCode: 200,
            body: 'Connected',
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err.stack,
        };
    }
};

export default onConnect(process.env.IN_MEMORY ? inMemoryDb : dynamoDb);
