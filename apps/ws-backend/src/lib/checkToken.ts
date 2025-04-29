import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

export function checkUser(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string") {
            return;
        }

        if (!decoded || !decoded.userId) {
            return;
        }

        return decoded;
    } catch (e: unknown) {
        return null;
    }
}