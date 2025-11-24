"use server";

import { CanvasElement } from "@/types/shape";
import drizzleClient from "@repo/db";
import { roomsTable } from "@repo/db/schema";
import { eq, and } from "drizzle-orm";

interface createRoomProps {
    savedElements: CanvasElement[];
    userName: string | null;
}

export async function createRoomWithElements({
    savedElements,
    userName,
}: createRoomProps): Promise<string | null> {
    if (!userName) {
        throw new Error("Username is not generated!");
    }

    try {
        const [room] = await drizzleClient
            .insert(roomsTable)
            .values({
                elements: JSON.stringify(savedElements),
                random_username: userName,
                is_shared: true,
            })
            .returning({ id: roomsTable.id });

        return room?.id || null;
    } catch (error: unknown) {
        console.error("Error creating room: ", error);
        return null;
    }
}

export async function getElementsByRoomId(
    roomId: string,
): Promise<CanvasElement[] | null> {
    try {
        const [room] = await drizzleClient
            .select({ elements: roomsTable.elements })
            .from(roomsTable)
            .where(eq(roomsTable.id, roomId))
            .limit(1);

        if (!room || !room.elements) {
            return null;
        }

        const elementsRaw = room.elements;
        try {
            let parsedElements: unknown;
            if (typeof elementsRaw === "string") {
                parsedElements = JSON.parse(elementsRaw);
                if (typeof parsedElements === "string") {
                    parsedElements = JSON.parse(parsedElements);
                }
            } else {
                parsedElements = elementsRaw;
            }
            return parsedElements as CanvasElement[];
        } catch (err) {
            console.error("Error parsing elements: ", err);
            return null;
        }
    } catch (error: unknown) {
        console.error("Error fetching elements:", error);
        throw new Error("Room not found");
    }
}

// Update room elements
export async function updateRoomElements(
    roomId: string,
    elements: CanvasElement[],
): Promise<void> {
    try {
        await drizzleClient
            .update(roomsTable)
            .set({
                elements: JSON.stringify(elements),
            })
            .where(eq(roomsTable.id, roomId));
    } catch (error) {
        console.error("Error updating room elements:", error);
        throw error;
    }
}

// Check if room exists
export async function roomExists(roomId: string): Promise<boolean> {
    try {
        const [room] = await drizzleClient
            .select({ id: roomsTable.id })
            .from(roomsTable)
            .where(eq(roomsTable.id, roomId))
            .limit(1);

        return !!room;
    } catch {
        return false;
    }
}

// Check if user is the room owner or not and it's on shared state or not
export async function isRoomOwner(
    roomId: string,
    username: string,
): Promise<boolean> {
    try {
        const [room] = await drizzleClient
            .select({ is_shared: roomsTable.is_shared })
            .from(roomsTable)
            .where(
                and(
                    eq(roomsTable.id, roomId),
                    eq(roomsTable.random_username, username)
                )
            )
            .limit(1);

        return room ? room.is_shared : false;
    } catch (error) {
        console.error("Error checking if room is shared:", error);
        throw error;
    }
}

export async function stopSharingRoom(roomId: string): Promise<void> {
    try {
        await drizzleClient
            .update(roomsTable)
            .set({
                is_shared: false,
            })
            .where(eq(roomsTable.id, roomId));
    } catch (error) {
        console.error("Failed to update room: ", error);
        throw error;
    }
}

// Check if user is the room owner or not and it's on shared state or not
export async function isRoomSharing(roomId: string): Promise<boolean> {
    try {
        const [room] = await drizzleClient
            .select({ is_shared: roomsTable.is_shared })
            .from(roomsTable)
            .where(eq(roomsTable.id, roomId))
            .limit(1);

        return room ? room.is_shared : false;
    } catch (error) {
        console.error("Error checking if room is shared:", error);
        throw error;
    }
}