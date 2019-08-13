const loggerErrors = [];

function logError(message, stackTrace) {
    const error = {
        message,
        stackTrace,
        date: Date.now().valueOf()
    };

    loggerErrors.push(error);
}

function debugErrors(date) {
    if (!date) {
        date = new Date("1970-01-01").valueOf();
    }

    const filteredErrors = loggerErrors.filter(logError => logError.date >= date);
    const mappedErrors = filteredErrors.map(logError => `${logError.message} - ${logError.stackTrace}`);
    if (mappedErrors.length > 0) {
        return mappedErrors.join("\n\n");
    }

    return "There are no errors";
}

module.exports = {
    logError,
    debugErrors
};