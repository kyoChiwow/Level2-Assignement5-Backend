import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";


export const handleValidationError = (
    err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = [];
    const errors = Object.values(err.errors);

    errors.forEach((error) => {
        errorSources.push({
            path: error.path,
            message: error.message,
        });
    });

    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources,
    };
}