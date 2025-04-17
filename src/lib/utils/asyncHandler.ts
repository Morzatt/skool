import { error } from "@sveltejs/kit"
import type pino from "pino"

export default async function async<T>(
    promise: Promise<T>,
    logger: pino.Logger<never, boolean>,
    context?: any
): Promise<T | undefined> {
    try {
        let data = await promise
        return data
    } catch (error) {
        handleError(logger, error, context)
    }
}

export function sync<T>(
    func: Function | T,
    logger: pino.Logger<never, boolean>,
    context?: any
): T | undefined {
    try {
        if (typeof func === "function") {
            let data = func()
            return data
        }

        let data = func
        return data
    } catch (error) {
        handleError(logger, error, context)
    }
}

export function handleError(logger: pino.Logger<never, boolean>, error: Error | unknown, context: any) {
    error instanceof Error ?
        logger.error({ err: error, context: context }, error.message)
        :
        logger.error({ err: error, context: context }, "");
}