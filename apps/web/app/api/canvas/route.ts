import { authOptions } from "@/lib/auth";
import { prismaClient } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("User not authenticated");
    }

    const body = await request.json();
    const { slug } = body;
    const email = session.user.email!;

    const isExistingUser = await prismaClient.user.findFirst({
        where: {
            email
        }
    })

    if (!isExistingUser) {
        return NextResponse.json("User not found", { status: 404 });
    }

    try {
        const newRoom = await prismaClient.canvas.create({
            data: {
                slug,
                userId: isExistingUser.id,
            }
        });

        return NextResponse.json({
            slug: newRoom.slug,
        }, { status: 200 })
    } catch (e: unknown) {
        return NextResponse.json({
            message: "Room name already exists!"
        }, {
            status: 409
        });
    }
}