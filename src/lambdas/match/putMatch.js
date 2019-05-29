import * as aws from 'aws-sdk';
import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import handleError from '../handleError';
import getUser from '../getUser';
import checkUser from '../checkUser';
import profanityFilter from '../profanityFilter';
import withCorsHeaders from '../withCorsHeaders';

const putMatch = db => async (event, context) => {
    try {
        const { id } = event.pathParameters;
        const getResult = await db.get(id);
        if (!getResult) {
            return withCorsHeaders({
                statusCode: 404,
                body: `match with id ${id} not found`,
            });
        }

        const user = getUser(event);
        if (!checkUser(user, getResult.match)) {
            return withCorsHeaders({
                statusCode: 401,
            });
        }
        const body = profanityFilter(JSON.parse(event.body));
        const result = await db.update(id, body);

        const arnParts = context.invokedFunctionArn.split(':');
        const sns = new aws.SNS();
        const topic = `arn:aws:sns:${arnParts[3]}:${arnParts[4]}:match-update`;
        await sns
            .publish({
                TopicArn: topic,
                Message: JSON.stringify({ user, updated: result }),
            })
            .promise();

        return withCorsHeaders({
            statusCode: 200,
            body: JSON.stringify(result),
        });
    } catch (err) {
        return handleError(err, event);
    }
};

exports.handler = putMatch(process.env.IN_MEMORY ? inMemoryDb : dynamo);
