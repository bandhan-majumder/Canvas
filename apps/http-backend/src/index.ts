import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SiginSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const port = process.env.PORT || "8080";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.send("All good");
});

app.post("/signup", async (req: Request, res: Response) => {
  const data = CreateUserSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      success: false,
      message: "Incorrect Inputs",
    });
    return;
  }

  const { email, password, name } = req.body;

  const isExistingUser = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  // if user already exists
  if (isExistingUser) {
    res.json({
      success: false,
      message: "User already exists!",
    });
    return;
  }

  // save the entry
  const newUser = await prismaClient.user.create({
    data: {
      email,
      password,
      name,
    },
  });

  res.json({
    success: true,
    message: "Signed up successfully",
    id: newUser.id,
  });
});

app.post("/signin", async (req: Request, res: Response) => {
  const data = SiginSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      success: false,
      message: "Incorrect inputs",
    });
    return;
  }

  const { email, password } = req.body;

  const isExistingUser = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (!isExistingUser) {
    res.json({
      success: false,
      message: "User does not exists!",
    });
    return;
  }

  // TODO: hash it back

  if (isExistingUser.password !== password) {
    res.json({
      success: false,
      password: "Invalid input fields",
    });
    return;
  }

  const token = jwt.sign({ userId: isExistingUser.id }, JWT_SECRET);

  res.json({
    success: true,
    message: "Signed in successfully",
    token,
  });
});

app.post("/create-room", middleware, async (req: Request, res: Response) => {
  const data = CreateRoomSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "Invalid input",
      success: false,
    });
    return;
  }

  const { name } = req.body;

  // coming from middleware
  // @ts-ignore
  const userId = req.userId;

  // check if user exists
  const isExistingUser = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!isExistingUser) {
    res.json({
      success: false,
      message: "Invalid user",
    });
  }

  // create a random hash slug
  const slug = name;

  try {
    // create a new room
    const newRoom = await prismaClient.canvas.create({
      data: {
        slug,
        userId,
      },
    });

    res.json({
      success: true,
      message: "Room created successfully",
      roomId: newRoom.id,
    });
  } catch (e: unknown) {
    console.error(e);
    res.json({
      success: false,
      message: "Room name already exists!",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = req.params.roomId;

  // check if the room exists
  const isExistingRoom = await prismaClient.canvas.findFirst({
    where: {
      id: roomId,
    },
  });

  if (!isExistingRoom) {
    res.json({
      success: false,
      message: "Room does not exist",
    });
  }

  // retrieve first 50 messages
  const first50Chats = await prismaClient.shape.findMany({
    where: {
      canvasId: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });

  res.json({
    success: true,
    message: "Chats retreived successfully",
    chats: first50Chats,
  });
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug.toString();

  // check if the room exists
  const isExistingRoom = await prismaClient.canvas.findFirst({
    where: {
      slug,
    },
  });

  if (!isExistingRoom) {
    res.json({
      success: false,
      message: "Room does not exist",
    });
  }

  res.json({
    success: true,
    message: "Room info retreived successfully",
    room: isExistingRoom,
  });
});
app.listen(port, () => {
  console.log("App is running at: ", port);
});
