/**
 * This file is for testing the database connection and basic operations.
 */

import drizzleClient from "./index";
import { roomsTable } from "./schema";

export async function testDbConnection(): Promise<boolean> {
    try {
        // Simple query to test the connection
        const allRoom = await drizzleClient.select().from(roomsTable).limit(1);
        console.log("Database connection test successful:", allRoom);
        return true;
    } catch (error) {
        console.error("Database connection test failed:", error);
        return false;
    }
}

testDbConnection()