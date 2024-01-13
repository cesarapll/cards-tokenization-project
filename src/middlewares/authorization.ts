import { Request, Response, NextFunction } from "express";

//TODO: Variable de entorno
const API_TOKEN = "pk_test_LsRBKejzCOEEWOsw"

export function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {

    const { authorization } = req.headers;

    if (!authorization || !authorization.toLowerCase().startsWith("bearer")) return res.status(401).json({ error: "API Token is not found" });

    if (authorization.split(" ")[1] !== API_TOKEN) return res.status(401).json({ error: "API Token is invalid" });

    next();

}