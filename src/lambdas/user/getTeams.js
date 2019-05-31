import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import getUser from '../getUser';
import withCorsHeaders from '../withCorsHeaders';

const getTeams = db => async event => {
    try {
        const teams = await db.getUserTeams(getUser(event));
        return withCorsHeaders({
            statusCode: 200,
            body: JSON.stringify(teams),
        });
    } catch (err) {
        return withCorsHeaders({
            statusCode: 500,
            body: err.message,
        });
    }
};

exports.handler = getTeams(process.env.IN_MEMORY ? inMemoryDb : dynamo);
