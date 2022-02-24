import { MongoClient, ObjectID } from 'mongodb';
import util from 'util';

const maxDaysForMatch = 6;
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
export default (connection, getDate) => {
    let db;
    MongoClient.connect(connection, { useNewUrlParser: true}, (err, database) => {
        console.log("connection", connection)
        if (err) {
            console.error(err);
            return;
        }

        db = database.db('scorebook');
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

    const queryParams = query => {
        let result = {};

        if (query.complete) {
            result = { ...result, 'match.complete': true };
        }
        if (query.user) {
            result = { ...result, 'match.user': query.user };
        }
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

    const add = util.promisify((match, user, callback) =>
        !db
            ? callback(undefined, undefined)
            : db
                  .collection('matches')
                  .insertOne({ ...match, match: { ...matchWithDate(match.match), user } }, (err, result) =>
                      callback(err, err ? undefined : { ...result.ops[0], id: result.ops[0]._id }),
                  ),
    );

    const getAll = util.promisify((query, callback) =>
        !db
            ? callback(undefined, [])
            : db
                  .collection('matches')
                  .find(queryParams(query))
                  .toArray((err, result) => callback(err, err ? [] : result.map(item => ({ ...item, id: item._id })))),
    );

    const get = util.promisify((id, callback) =>
        !db
            ? callback(undefined, undefined)
            : db
                  .collection('matches')
                  .findOne({ _id: new ObjectID(id) }, (err, item) =>
                      callback(
                          item === null ? new Error('notfound') : err,
                          err || item === null ? undefined : { ...item, id: item._id },
                      ),
                  ),
    );

    const update = util.promisify((id, match, callback) => {
        if (!db) {
            callback(undefined, undefined);
        }
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
                        { upsert: true },
                    );
                }
                callback(undefined, match);
            } catch (err) {
                callback(err, undefined);
            }
        });
    });

    const remove = util.promisify((id, callback) =>
        !db
            ? callback(undefined, undefined)
            : db
                  .collection('matches')
                  .deleteOne({ _id: new ObjectID(id) }, (err, res) =>
                      callback(res.deletedCount < 1 ? new Error('notfound') : err, true),
                  ),
    );

    const recordUserTeams = util.promisify((user, teams) => {
        if (!db) return;
        db.collection('userTeams')
            .find({ user })
            .toArray((err, result) => {
                if (err) {
                    return;
                }
                if (result.length === 0) {
                    db.collection('userTeams').insertOne({
                        user,
                        teams,
                    });
                } else {
                    const userTeams = result[0];
                    db.collection('userTeams').updateOne(
                        { _id: new ObjectID(userTeams._id) },
                        {
                            $set: {
                                user: userTeams.user,
                                teams: [
                                    ...userTeams.teams.filter(
                                        t => !teams.map(team => team.name).find(tn => tn === t.name),
                                    ),
                                    ...teams,
                                ],
                            },
                        },
                    );
                }
            });
    });

    const getUserTeams = util.promisify((user, callback) =>
        !db
            ? callback(undefined, undefined)
            : db
                  .collection('userTeams')
                  .findOne({ user }, (err, item) =>
                      callback(
                          item === null ? new Error('notfound') : err,
                          err || item === null ? undefined : { user, teams: item.teams },
                      ),
                  ),
    );

    return {
        add,
        getAll,
        get,
        update,
        remove,
        recordUserTeams,
        getUserTeams,
    };
};
/* eslint-enable no-underscore-dangle */
/* eslint-enable no-console */
