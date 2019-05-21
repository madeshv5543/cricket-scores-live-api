const awsSdk = 'aws-sdk';
module.exports = name => {
    return !name.match(awsSdk);
};
