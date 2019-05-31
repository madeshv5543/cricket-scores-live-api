import inMemoryDb from '../../db/inMemory';
import dynamoDb from '../../db/dynamo';
import toLowerCaseProps from '../toLowerCaseProps';

const onMatchId = db => async event => {
    try {
        const { matchid } = toLowerCaseProps(JSON.parse(event.body));
        await db.setMatchId(event.requestContext.connectionId, matchid);
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
