import { MongoClient, ObjectID } from 'mongodb';

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
export default (connection) => {
    let db;
    MongoClient.connect(connection, { useNewUrlParser: true }, (err, database) => {
        if (err) {
            console.error(err);
            return;
        }

        db = database.db('cricket-scores-live');
    });

    const queryParams = (query) => {
        let result = {};

        if (query.complete) { result = { ...result, 'match.complete': true }; }
        if (query.user) { result = { ...result, 'match.user': query.user }; }
        if (query.inprogress) { result = { ...result, 'match.complete': false }; }
        return result;
    };

    const add = (match, callback) => (!db
        ? callback(undefined, undefined)
        : db.collection('matches').insertOne(match, (err, result) => callback(
            err,
            err
                ? undefined
                : { ...result.ops[0], id: result.ops[0]._id }
        )));

    const getAll = (query, callback) => (!db
        ? callback(undefined, [])
        : db.collection('matches').find(queryParams(query)).toArray((err, result) => callback(
            err,
            err
                ? []
                : result.map(item => ({ ...item, id: item._id }))
        )));

    const get = (id, callback) => (!db
        ? callback(undefined, undefined)
        : db.collection('matches').findOne({ _id: new ObjectID(id) }, (err, item) => callback(
            err,
            err ? undefined : { ...item, id: item._id }
        )));

    const update = (id, match, callback) => (!db
        ? callback(undefined, undefined)
        : db.collection('matches').update({ _id: new ObjectID(id) }, match, err => callback(
            err,
            err
                ? undefined
                : { ...match, id }
        )));


    return {
        add,
        getAll,
        get,
        update,
    };
};
/* eslint-enable no-underscore-dangle */
/* eslint-enable no-console */
