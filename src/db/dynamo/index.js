import connections from './connections';
import matches from './matches';
import userTeams from './userTeams';

export default {
    ...connections,
    ...matches(() => new Date()),
    ...userTeams,
};
