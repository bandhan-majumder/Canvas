import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name } = body;
  
    if (!email || !password || !name) {
        return NextResponse.json("Missing required fields", { status: 400 });
    }
    const existingUser = await prismaClient.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return NextResponse.json("User already exists", { status: 409 });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prismaClient.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });
    if (!newUser) {
        return NextResponse.json("User creation failed", { status: 500 });
    }
    return NextResponse.json("User created successfully", { status: 201 });
}