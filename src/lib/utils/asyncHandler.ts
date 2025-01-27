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

function handleError(logger: pino.Logger<never, boolean>, error: Error | unknown, context: any) {
    error instanceof Error ?
        logger.error({ err: error, context: context }, error.message)
        :
        logger.error({ err: error, context: context }, "");
}