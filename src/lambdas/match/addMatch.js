import * as aws from 'aws-sdk';
import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import getUser from '../getUser';
import profanityFilter from '../profanityFilter';

const addMatch = db => async (event, context) => {
    try {
        const user = getUser(event);
        const body = profanityFilter(JSON.parse(event.body));
        const result = await db.add(body, user);

        const arnParts = context.invokedFunctionArn.split(':');
        const sns = new aws.SNS();
        const topic = `arn:aws:sns:${arnParts[3]}:${arnParts[4]}:match-update`;
        await sns
            .publish({
                TopicArn: topic,
                Message: JSON.stringify({ user, add: result }),
            })
            .promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(result),
        };
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = addMatch(process.env.IN_MEMORY ? inMemoryDb : dynamo);
