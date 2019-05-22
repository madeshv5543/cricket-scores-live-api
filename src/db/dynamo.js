import * as aws from 'aws-sdk';

const connectionsTable = 'cricket-scores-connections';
const resourceNotFoundException = /^resourcenotfoundexception$/i;

const createTable = () =>
    new Promise((resolve, reject) => {
        const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
        const createParams = {
            TableName: connectionsTable,
            AttributeDefinitions: [
                {
                    AttributeName: 'connectionId',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'connectionId',
                    KeyType: 'HASH',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        };
        db.createTable(createParams, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });

const dynamo = () => {
    const execute = (funcName, params) =>
        new Promise((resolve, reject) => {
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            db[funcName](params, err => {
                if (err && !err.code.match(resourceNotFoundException)) {
                    reject(err);
                    return;
                }

                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });

    const createIfMissing = async func => {
        const success = await func();
        if (success) return true;
        await createTable();
        const retrySuccess = await func();
        return retrySuccess;
    };

    const addConnection = (id, url) =>
        new Promise(async (resolve, reject) => {
            try {
                const params = {
                    TableName: connectionsTable,
                    Item: {
                        connectionId: { S: id },
                        url: { S: url },
                    },
                };
                const success = await createIfMissing(() => execute('putItem', params));
                if (success) {
                    resolve();
                    return;
                }
                reject(new Error());
            } catch (err) {
                reject(err);
            }
        });

    const removeConnection = id =>
        new Promise(async (resolve, reject) => {
            try {
                const params = {
                    TableName: connectionsTable,
                    Key: {
                        connectionId: { S: id },
                    },
                };
                const success = await createIfMissing(() => execute('deleteItem', params));
                if (success) {
                    resolve();
                    return;
                }
                reject(new Error());
            } catch (err) {
                reject(err);
            }
        });

    const setMatchIds = (id, matchIds) =>
        new Promise(async (resolve, reject) => {
            try {
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
                const success = await createIfMissing(() => execute('updateItem', params));
                if (success) {
                    resolve();
                } else {
                    reject(new Error());
                }
            } catch (err) {
                reject(err);
            }
        });

    return {
        addConnection,
        removeConnection,
        setMatchIds,
    };
};

export default dynamo();
