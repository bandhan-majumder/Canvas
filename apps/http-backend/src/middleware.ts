import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers["authorization"] ?? "";
    const token = bearerToken.split(" ")[1] ?? "";
    const decoded = jwt.verify(token,  JWT_SECRET);

    if (decoded) {
        // TODO: how to update the tyeps of a request object
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    }else {
        res.status(403).json({
            success: false,
            message: "Unauthorized"
        })
    }
}