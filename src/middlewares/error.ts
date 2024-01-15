import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../handlers/error-handler";

export function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
    try {
        const errorData = ErrorHandler.buildErrorData(error);
        return res.status(errorData.statusCode).send({ message: errorData.message });
    } catch (error) {
        next(error)
    }
}
