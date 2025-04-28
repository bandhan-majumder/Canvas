import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const port = process.env.PORT || "3001";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("All good");
})

app.get("/signup", (req, res) => {

})

app.post("/signin", (req, res) => {

})

app.listen(port, () => {
    console.log("App is running at: ", port);
})