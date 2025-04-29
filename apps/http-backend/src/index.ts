import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { middleware } from "./middleware";

const port = process.env.PORT || "3001";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("All good");
})

app.post("/signup", (req, res) => {
    const { username, password } = req.body();

    // TODO: do zod validation

    // sign it up

    res.json({
        success: true,
        message: "Signed up successfully"
    })
})

app.post("/signin", (req, res) => {
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

app.post("/create-room", middleware, (req, res) => {

    res.json({
        success: false,
        message: "Room created successfully"
    })
})

app.listen(port, () => {
    console.log("App is running at: ", port);
})