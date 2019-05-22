import uuid from 'uuid/v1';

const inMemoryDb = () => {
    const matches = [];
    const connections = {};

    const findMatch = id => matches.find(m => m.id === id);

    const add = (match, callback) => {
        const id = uuid();
        const matchWithId = { ...match, id };
        matches.push(matchWithId);
        callback(undefined, matchWithId);
    };

    const update = (id, match, callback) => {
        const matchToUpdate = findMatch(id);
        if (typeof matchToUpdate === 'undefined') {
            add(match, callback);
        } else {
            matches.splice(matches.indexOf(matchToUpdate), 1);
            matches.push(match);
            callback(undefined, match);
        }
    };

    const getAll = (query, callback) =>
        callback(
            undefined,
            matches.filter(
                item =>
                    (!query.complete || item.match.complete) &&
                    (!query.inprogress || !item.match.complete) &&
                    (!query.user || query.user === item.match.user),
            ),
        );

    const get = (id, callback) => {
        const match = findMatch(id);
        if (typeof match === 'undefined') {
            callback(new Error('notfound'), undefined);
        } else {
            callback(undefined, match);
        }
    };

    const remove = (id, callback) => {
        const match = findMatch(id);
        if (typeof match === 'undefined') {
            callback(new Error('notfound'), undefined);
        } else {
            matches.splice(matches.indexOf(match), 1);
            callback(undefined);
        }
    };

    const addConnection = (id, url) =>
        new Promise(resolve => {
            connections[id] = { url };
            resolve();
        });

    const removeConnection = id =>
        new Promise(resolve => {
            delete connections[id];
            resolve();
        });

    const setMatchIds = (id, matchIds) =>
        new Promise(async resolve => {
            connections[id].matchIds = matchIds;
            resolve();
        });

    return {
        add,
        update,
        getAll,
        get,
        remove,
        recordUserTeams: () => {},
        getUserTeams: () => null,
        addConnection,
        removeConnection,
        setMatchIds,
    };
};

export default inMemoryDb();
