import * as aws from 'aws-sdk';
import * as ensureApiGatewayManagementApi from 'aws-apigatewaymanagementapi';

const matchUpdatesMsg = 'matchupdates';
const scorecardUpdateMsg = 'scorecardupdate';
const newMatchMsg = 'newmatch';

export default db => {
    ensureApiGatewayManagementApi(aws);

    const matchUpdate = async item => {
        const scorecardUpdate = update => {
            const apiGateway = new aws.ApiGatewayManagementApi({
                apiVersion: '2018-11-29',
                endpoint: update.url,
            });

            return apiGateway
                .postToConnection({
                    ConnectionId: update.connectionId,
                    Data: JSON.stringify({
                        action: scorecardUpdateMsg,
                        updates: { match: item.match, lastEvent: item.lastEvent },
                    }),
                })
                .promise();
        };

        const statusUpdate = update => {
            const apiGateway = new aws.ApiGatewayManagementApi({
                apiVersion: '2018-11-29',
                endpoint: update.url,
            });

            return apiGateway
                .postToConnection({
                    ConnectionId: update.connectionId,
                    Data: JSON.stringify({
                        action: matchUpdatesMsg,
                        updates: [{ id: item.id, status: item.match.status, lastEvent: item.lastEvent }],
                    }),
                })
                .promise();
        };

        try {
            const scorecardUpdates = await db.getForMatch(item.id);
            const matchUpdates = await db.getForAllMatches();

            const scorecards = scorecardUpdates.map(scorecardUpdate);
            const matches = matchUpdates.map(statusUpdate);

            await Promise.all([...scorecards, ...matches]);
        } catch (err) {
            console.error(err);
        }
    };

    const matchAdd = async item => {
        try {
            const matchUpdates = await db.getForAllMatches();
            const updates = matchUpdates.map(update => {
                const apiGateway = new aws.ApiGatewayManagementApi({
                    apiVersion: '2018-11-29',
                    endpoint: update.url,
                });

                return apiGateway
                    .postToConnection({
                        ConnectionId: update.connectionId,
                        Data: JSON.stringify({
                            action: newMatchMsg,
                            updates: {
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
                            },
                        }),
                    })
                    .promise();
            });
            await Promise.all(updates);
        } catch (err) {
            console.error(err);
        }
    };

    return { matchUpdate, matchAdd };
};
