import socketIO from 'socket.io';

export default (server) => {
    const io = socketIO(server);
    io.on('connection', () => {
    });

    const matchUpdated = (match) => {
        /* eslint-disable no-console */
        console.log(match);
    };

    return {
        matchUpdated,
    };
};
