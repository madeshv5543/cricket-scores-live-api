import * as aws from 'aws-sdk';

const connectionsTable = 'cricket-scores-connections';

const connections = () => {
    const addConnection = (id, url) =>
        new Promise((resolve, reject) => {
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            const params = {
                TableName: connectionsTable,
                Item: {
                    connectionId: { S: id },
                    matchId: { S: '-' },
                    url: { S: url },
                },
            };
            db.putItem(params, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });

    const removeConnection = id =>
        new Promise((resolve, reject) => {
            const params = {
                TableName: connectionsTable,
                Key: {
                    connectionId: { S: id },
                },
            };
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            db.deleteItem(params, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });

    const setMatchId = (id, matchId) =>
        new Promise((resolve, reject) => {
            const params = {
                TableName: connectionsTable,
                Key: {
                    connectionId: { S: id },
                },
                UpdateExpression: 'set matchId = :matchId',
                ExpressionAttributeValues: {
                    ':matchId': { S: matchId },
                },
            };
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            db.updateItem(params, err => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }

                resolve();
            });
        });

    return {
        addConnection,
        removeConnection,
        setMatchId,
    };
};

export default connections();
