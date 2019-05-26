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

    const setMatchIds = (id, matchIds) =>
        new Promise((resolve, reject) => {
            const params = {
                TableName: connectionsTable,
                Key: {
                    connectionId: { S: id },
                },
                UpdateExpression: 'set matchIds = :matchIds',
                ExpressionAttributeValues: {
                    ':matchIds': { SS: matchIds },
                },
            };
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            db.updateItem(params, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });

    return {
        addConnection,
        removeConnection,
        setMatchIds,
    };
};

export default connections();
