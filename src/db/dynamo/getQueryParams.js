const maxDaysForMatch = 6;

export default getDate => query => {
    const firstDateForInProgress = () => {
        const firstDate = getDate();
        firstDate.setDate(firstDate.getDate() - maxDaysForMatch);
        return firstDate;
    };

    const addUser = params => {
        if (!query.user) return params;
        return {
            ...params,
            IndexName: 'userIndex',
            KeyConditionExpression: 'userId = :user',
            ExpressionAttributeValues: { ...params.ExpressionAttributeValues, ':user': { S: query.user } },
        };
    };

    const addCompletionWithDate = (params, test, operator) => {
        if (!test) return params;
        const includeUser = !!query.user;
        const expression = `${
            includeUser ? 'userId__complete = :userId__complete' : 'complete = :complete'
        } and matchDate ${operator} :date`;
        const completeParam = includeUser
            ? { ':userId__complete': { S: `${query.user}__FALSE` } }
            : { ':complete': { S: 'FALSE' } };
        return {
            ...params,
            IndexName: includeUser ? 'userCompleteIndex' : 'completeIndex',
            KeyConditionExpression: expression,
            ExpressionAttributeValues: {
                ':date': {
                    N: firstDateForInProgress()
                        .getTime()
                        .toString(),
                },
                ...completeParam,
            },
        };
    };

    const addComplete = params => {
        if (!query.complete) return params;
        const includeUser = !!query.user;
        const completeParam = includeUser
            ? { ':userId__complete': { S: `${query.user}__TRUE` } }
            : { ':complete': { S: 'TRUE' } };
        return {
            ...params,
            IndexName: includeUser ? 'userCompleteIndex' : 'completeIndex',
            KeyConditionExpression: includeUser ? 'userId__complete = :userId__complete' : 'complete = :complete',
            ExpressionAttributeValues: completeParam,
        };
    };

    const initialParams = {
        IndexName: '',
        KeyConditionExpression: '',
        ExpressionAttributeValues: {},
    };

    const withUser = addUser(initialParams, query);
    const withInProgress = addCompletionWithDate(withUser, query.inprogress, '>');
    const withExpectedComplete = addCompletionWithDate(withInProgress, query.expectedcomplete, '<');
    const withComplete = addComplete(withExpectedComplete);

    return withComplete;
};
