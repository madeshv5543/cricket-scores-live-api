import util from 'util';
import dynamo from '../../db/dynamo';
import inMemoryDb from '../../db/inMemory';
import getUser from '../getUser';

const getMatches = db => async event => {
    const teams = await util.promisify(db.getUserTeams)(getUser(event));

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(teams),
    };
};

exports.handler = getMatches(process.env.IN_MEMORY ? inMemoryDb : dynamo);
