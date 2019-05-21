export default (err, req) => {
    if (err.message && err.message === 'notfound') {
        return {
            statusCode: 404,
            body: `match with id ${req.params.id} not found`,
        };
    }

    return {
        statusCode: 500,
        body: err.message,
    };
};
