import { MongoClient, ObjectID } from 'mongodb';

const maxDaysForMatch = 6;
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
export default (connection, getDate) => {
    let db;
    MongoClient.connect(connection, { useNewUrlParser: true }, (err, database) => {
        if (err) {
            console.error(err);
            return;
        }

        db = database.db('cricket-scores-live');
    });

    const matchWithDate = match => ({
        ...match,
        date: new Date(match.date),
    });

    const firstDateForInProgress = () => {
        const firstDate = getDate();
        firstDate.setDate(firstDate.getDate() - maxDaysForMatch);
        return firstDate;
    };

    const queryParams = (query) => {
        let result = {};

        if (query.complete) { result = { ...result, 'match.complete': true }; }
        if (query.user) { result = { ...result, 'match.user': query.user }; }
        if (query.inprogress) {
            result = {
                ...result,
                'match.complete': false,
                'match.date': { $gt: firstDateForInProgress() },
            };
        }
        if (query.expectedcomplete) {
            result = {
                ...result,
                'match.complete': false,
                'match.date': { $lte: firstDateForInProgress() },
            };
        }
        return result;
    };

    const add = (match, user, callback) => (!db
        ? callback(undefined, undefined)
        : db.collection('matches').insertOne(
            {
                ...match,
                match: { ...matchWithDate(match.match), user },
            },
            (err, result) => callback(
                err,
                err
                    ? undefined
                    : { ...result.ops[0], id: result.ops[0]._id }
            )
        ));

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
            item === null ? new Error('notfound') : err,
            err || item === null ? undefined : { ...item, id: item._id }
        )));

    const update = (id, match, callback) => {
        if (!db) { callback(undefined, undefined); }
        get(id, (_, item) => {
            try {
                if (typeof item === 'undefined' || item.version < match.version) {
                    db.collection('matches').updateOne(
                        { _id: new ObjectID(id) },
                        {
                            $set: {
                                ...match,
                                match: matchWithDate(match.match),
                            },
                        },
                        { upsert: true }
                    );
                }
                callback(undefined, match);
            } catch (err) {
                callback(err, undefined);
            }
        });
    };

    const remove = (id, callback) => (!db
        ? callback(undefined, undefined)
        : db.collection('matches').deleteOne({ _id: new ObjectID(id) }, (err, res) => callback(
            res.deletedCount < 1 ? new Error('notfound') : err,
            true
        )));

    return {
        add,
        getAll,
        get,
        update,
        remove,
    };
};
/* eslint-enable no-underscore-dangle */
/* eslint-enable no-console */
