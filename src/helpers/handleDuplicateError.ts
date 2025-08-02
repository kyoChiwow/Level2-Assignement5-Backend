/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";


export const handleDuplicatedError = (err: any) : TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/);

    return {
        statusCode: 400,
        message: `Duplicate field value: ${matchedArray[1]}. Please use another value!`,
    }
}