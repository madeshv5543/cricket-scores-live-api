import * as aws from 'aws-sdk';

const userTeamsTable = 'cricket-scores-user-teams';

const userTeams = () => {
    const recordUserTeams = (user, teams) =>
        new Promise(resolve => {
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            db.getItem({ TableName: userTeamsTable, Key: { userId: { S: user } } }, (err, item) => {
                if (err) {
                    resolve();
                    return;
                }

                if (item && item.Item) {
                    const params = {
                        TableName: userTeamsTable,
                        Key: {
                            userId: { S: user },
                        },
                        UpdateExpression: 'set teams = :teams',
                        ExpressionAttributeValues: {
                            ':teams': {
                                S: JSON.stringify([
                                    ...JSON.parse(item.Item.teams.S).filter(
                                        t => !teams.map(team => team.name).find(tn => tn === t.name),
                                    ),
                                    ...teams,
                                ]),
                            },
                        },
                    };

                    db.updateItem(params, () => {
                        resolve();
                    });
                } else {
                    const params = {
                        TableName: userTeamsTable,
                        Item: {
                            userId: { S: user },
                            teams: { S: JSON.stringify(teams) },
                        },
                    };

                    db.putItem(params, () => {
                        resolve();
                    });
                }
            });
        });

    const getUserTeams = user =>
        new Promise(resolve => {
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            db.getItem({ TableName: userTeamsTable, Key: { userId: { S: user } } }, (err, item) => {
                resolve({ user, teams: item && item.Item ? JSON.parse(item.Item.teams.S) : [] });
            });
        });

    return { recordUserTeams, getUserTeams };
};

export default userTeams();
