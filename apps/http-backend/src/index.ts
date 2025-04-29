import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SiginSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client"

const port = process.env.PORT || "3001";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("All good");
})

app.post("/signup", (req: Request, res: Response) => {

    const data = CreateUserSchema.safeParse(req.body);

    if (!data.success) {
        res.json({
            success: false,
            message: "Incorrect Inputs"
        })
        return;
    }

    const { username, password } = req.body();

    // TODO: do zod validation

    // sign it up

    res.json({
        success: true,
        message: "Signed up successfully"
    })
})

app.post("/signin", (req: Request, res: Response) => {

    const data = SiginSchema.safeParse(req.body());

    if (!data.success) {
        res.json({
            success: false,
            message: "Incorrect inputs"
        })
        return;
    }

    const { username, password } = req.body();

    // sign in

    const userId = 1;

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        success: true,
        message: "Signed in successfully",
        token
    })
})

app.post("/create-room", middleware, (req: Request, res: Response) => {
    const data = CreateRoomSchema.safeParse(req.body());

    if (!data.success) {
        res.json({
            message: "Invalid input",
            success: false
        })
        return;
    }

    res.json({
        success: false,
        message: "Room created successfully"
    })
})

app.listen(port, () => {
    console.log("App is running at: ", port);
})