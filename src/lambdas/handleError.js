import withCorsHeaders from './withCorsHeaders';

export default (err, req) => {
    if (err.message && err.message === 'notfound' && req.params && req.params.id) {
        return withCorsHeaders({
            statusCode: 404,
            body: `match with id ${req.params.id} not found`,
        });
    }

    return withCorsHeaders({
        statusCode: 500,
        body: err.message,
    });
};
