import authenticate from './authenticate';

let data;

exports.handler = async event => {
    try {
        data = await authenticate(event);
    } catch (err) {
        console.log(err);
        return `Unauthorised: ${err.message}`;
    }

    return data;
};
