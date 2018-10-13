import uuid from 'uuid/v1';

const inMemoryDb = () => {
    const matches = [];

    const findMatch = id => matches.find(m => m.id === id);

    const add = (match, callback) => {
        const id = uuid();
        const matchWithId = { ...match, id, _id: id };
        matches.push(matchWithId);
        callback(undefined, matchWithId);
    };

    const update = (match, callback) => {
        const matchToUpdate = findMatch(match.id);
        if (typeof matchToUpdate === 'undefined') {
            callback(new Error('notfound'), undefined);
        } else {
            matches.splice(matches.indexOf(matchToUpdate), 1);
            matches.push(match);
            callback(undefined, match);
        }
    };

    const getAll = callback => callback(undefined, matches);

    const get = (id, callback) => {
        const match = findMatch(id);
        if (typeof match === 'undefined') {
            callback(new Error('notfound'), undefined);
        } else {
            callback(undefined, match);
        }
    };

    return {
        add,
        update,
        getAll,
        get,
    };
};

export default inMemoryDb();
