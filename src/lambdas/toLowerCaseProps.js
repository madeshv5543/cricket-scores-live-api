export default obj =>
    Object.keys(obj).reduce(
        (lower, key) => ({
            ...lower,
            [key.toLowerCase()]: obj[key],
        }),
        {},
    );
