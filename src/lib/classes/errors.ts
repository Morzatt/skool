// what function was called,
// which arguments were passed to,
// which tables were involved, 
// stack trace,
// timestamp,
// which user was calling the function

abstract class GenericError extends Error {
    constructor(message?: string) {
        super(message)
    }

    abstract statusCode: number;
}
