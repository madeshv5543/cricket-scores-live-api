import util from 'util';
import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import getUser from '../getUser';
import withCorsHeaders from '../withCorsHeaders';

const getMatches = db => async event => {
    const teams = await util.promisify(db.getUserTeams)(getUser(event));

    return withCorsHeaders({
        statusCode: 200,
        body: JSON.stringify(teams),
    });
};

exports.handler = getMatches(process.env.IN_MEMORY ? inMemoryDb : dynamo);
