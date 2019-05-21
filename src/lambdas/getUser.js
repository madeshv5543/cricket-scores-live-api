import jwtDecode from 'jwt-decode';

export default req => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    return jwtDecode(authHeader.split(' ')[1]).sub;
};
