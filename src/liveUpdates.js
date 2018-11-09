import socketIO from 'socket.io';

export default (server) => {
    const updatesNamespace = '/matchupdates';
    const scorecardsNamespace = '/scorecards';
    const matchdIdsMsg = 'matchids';
    const matchdIdMsg = 'matchid';
    const matchUpdatesMsg = 'matchupdates';
    const scorecardUpdateMsg = 'scorecardupdate';
    const newMatchMsg = 'newmatch';

    const updateSubscriptions = {};
    const scorecardSubscriptions = {};

    const io = socketIO(server);
    io.of(updatesNamespace).on('connection', (socket) => {
        updateSubscriptions[socket.id] = {
            socket,
            matchIds: [],
        };

        socket.on(matchdIdsMsg, (matchids) => {
            updateSubscriptions[socket.id].matchIds = matchids;
        });
        socket.on('disconnect', () => {
            delete updateSubscriptions[socket.id];
        });
    });

    io.of(scorecardsNamespace).on('connection', (socket) => {
        scorecardSubscriptions[socket.id] = {
            socket,
        };

        socket.on(matchdIdMsg, (matchId) => {
            scorecardSubscriptions[socket.id].matchId = matchId;
        });
        socket.on('disconnect', () => {
            delete scorecardSubscriptions[socket.id];
        });
    });

    const matchUpdated = item => new Promise((resolve) => {
        Object.keys(updateSubscriptions)
            .filter(key => updateSubscriptions[key].matchIds.includes(item.match.id))
            .forEach(key => updateSubscriptions[key].socket.emit(
                matchUpdatesMsg,
                [{
                    id: item.match.id,
                    status: item.match.status,
                    lastEvent: item.lastEvent,
                }]
            ));

        Object.keys(scorecardSubscriptions)
            .filter(key => scorecardSubscriptions[key].matchId === item.match.id)
            .forEach(key => scorecardSubscriptions[key].socket.emit(
                scorecardUpdateMsg,
                item.match
            ));

        resolve();
    });

    const matchAdded = item => new Promise((resolve) => {
        io.of(updatesNamespace).emit(newMatchMsg, {
            id: item.id,
            date: item.match.date,
            user: item.match.user,
            homeTeam: item.match.homeTeam.name,
            awayTeam: item.match.awayTeam.name,
            status: item.match.status,
            version: item.version || 0,
            lastEvent: item.lastEvent,
        });

        resolve();
    });

    return {
        matchUpdated,
        matchAdded,
    };
};
