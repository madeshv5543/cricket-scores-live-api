import * as aws from 'aws-sdk';
import uuid from 'uuid/v4';
import getQueryParams from './getQueryParams';

const matchesTable = 'cricket-scores-matches';

export default getDate => {
    const queryParams = getQueryParams(getDate);
    const negativeToUndefined = num => (num < 0 ? undefined : num);

    const add = (body, user) =>
        new Promise((resolve, reject) => {
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            const id = body.match.id || uuid();
            const item = {
                id: { S: id },
                userId: { S: user },
                complete: { S: body.match.complete.toString().toUpperCase() },
                userId__complete: { S: `${user}__${body.match.complete.toString().toUpperCase()}` },
                matchDate: { N: new Date(body.match.date).getTime().toString() },
                version: { N: body.version.toString() },
                currentBatterIndex: {
                    N: (typeof body.currentBatterIndex === 'undefined' ? -1 : body.currentBatterIndex).toString(),
                },
                currentBowlerIndex: {
                    N: (typeof body.currentBowlerIndex === 'undefined' ? -1 : body.currentBowlerIndex).toString(),
                },
                progress: { S: JSON.stringify(body.match) },
            };
            if (body.lastEvent) item.lastEvent = { S: body.lastEvent };

            const params = {
                TableName: matchesTable,
                Item: item,
            };
            db.putItem(params, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ ...body, id });
            });
        });

    const update = (id, body) =>
        new Promise((resolve, reject) => {
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            const expression =
                'set complete = :complete, version = :version, currentBatterIndex = :currentBatterIndex, ' +
                `currentBowlerIndex = :currentBowlerIndex, progress = :progress${
                    body.lastEvent ? ', lastEvent = :lastEvent' : ''
                }, userId__complete = :userId__complete`;
            const values = {
                ':complete': { S: body.match.complete.toString().toUpperCase() },
                ':progress': { S: JSON.stringify(body.match) },
                ':version': { N: body.version.toString() },
                ':currentBatterIndex': {
                    N: (typeof body.currentBatterIndex === 'undefined' ? -1 : body.currentBatterIndex).toString(),
                },
                ':currentBowlerIndex': {
                    N: (typeof body.currentBowlerIndex === 'undefined' ? -1 : body.currentBowlerIndex).toString(),
                },
                ':userId__complete': { S: `${body.match.user}__${body.match.complete.toString().toUpperCase()}` },
            };
            if (body.lastEvent) values[':lastEvent'] = { S: body.lastEvent };
            const params = {
                TableName: matchesTable,
                Key: {
                    id: { S: id },
                },
                UpdateExpression: expression,
                ExpressionAttributeValues: values,
            };

            db.updateItem(params, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ ...body, id });
            });
        });

    const getAll = query =>
        new Promise((resolve, reject) => {
            const queryCallback = (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(
                    data.Items.map(item => ({ ...item, match: JSON.parse(item.progress.S) })).map(item => ({
                        id: item.id.S,
                        date: item.match.date,
                        user: item.userId.S,
                        homeTeam: item.match.homeTeam.name,
                        awayTeam: item.match.awayTeam.name,
                        status: item.match.status,
                        version: item.version ? Number(item.version.N) : 0,
                        lastEvent: item.lastEvent ? item.lastEvent.S : undefined,
                    })),
                );
            };
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            const params = queryParams(query);
            if (params.IndexName === '') {
                db.scan({ TableName: matchesTable }, queryCallback);
            } else {
                db.query({ ...params, TableName: matchesTable }, queryCallback);
            }
        });

    const get = id =>
        new Promise((resolve, reject) => {
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            const params = {
                TableName: matchesTable,
                Key: { id: { S: id } },
            };

            db.getItem(params, (err, item) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(
                    item && item.Item
                        ? {
                              id,
                              match: JSON.parse(item.Item.progress.S),
                              version: Number(item.Item.version.N),
                              currentBatterIndex: negativeToUndefined(Number(item.Item.currentBatterIndex.N)),
                              currentBowlerIndex: negativeToUndefined(Number(item.Item.currentBowlerIndex.N)),
                              lastEvent: item.Item.lastEvent ? item.Item.lastEvent.S : undefined,
                          }
                        : undefined,
                );
            });
        });

    const remove = id =>
        new Promise((resolve, reject) => {
            const db = new aws.DynamoDB({ apiVersion: '2012-10-08' });
            const params = {
                TableName: matchesTable,
                Key: {
                    id: { S: id },
                },
            };
            db.deleteItem(params, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });

    return {
        add,
        get,
        getAll,
        update,
        remove,
    };
};
