import * as aws from 'aws-sdk';
import * as ensureApiGatewayManagementApi from 'aws-apigatewaymanagementapi';

const matchUpdatesMsg = 'matchupdates';
const scorecardUpdateMsg = 'scorecardupdate';
const newMatchMsg = 'newmatch';

export default db => {
    ensureApiGatewayManagementApi(aws);
    const apiGateway = new aws.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
    });

    const matchUpdate = async item => {
        try {
            const scorecardUpdates = await db.getForMatch(item.id);
            const matchUpdates = await db.getForAllMatches();

            scorecardUpdates.forEach(update => {
                apiGateway.endpoint = update.url;
                apiGateway.postToConnection({
                    ConnectionId: update.connectionId,
                    Data: JSON.stringify({ action: scorecardUpdateMsg, match: item.match, lastEvent: item.lastEvent }),
                });
            });

            matchUpdates.forEach(update => {
                apiGateway.endpoint = update.url;
                apiGateway.postToConnection({
                    ConnectionId: update.connectionId,
                    Data: JSON.stringify({
                        action: matchUpdatesMsg,
                        updates: [{ id: item.match.id, status: item.match.status, lastEvent: item.lastEvent }],
                    }),
                });
            });
        } catch (err) {
            console.error(err);
        }
    };

    const matchAdd = async item =>
        new Promise(async resolve => {
            try {
                const matchUpdates = await db.getForAllMatches();
                matchUpdates.forEach(update => {
                    apiGateway.endpoint = update.url;
                    apiGateway.postToConnection(
                        {
                            ConnectionId: update.connectionId,
                            Data: JSON.stringify({
                                action: newMatchMsg,
                                match: {
                                    id: item.id,
                                    date: item.match.date,
                                    user: item.match.user,
                                    homeTeam: item.match.homeTeam.name,
                                    awayTeam: item.match.awayTeam.name,
                                    status: item.match.status,
                                    version: item.version || 0,
                                    lastEvent: item.lastEvent,
                                },
                            }),
                        },
                        () => {
                            resolve();
                        },
                    );
                });
            } catch (err) {
                console.error(err);
            }
        });

    return { matchUpdate, matchAdd };
};
