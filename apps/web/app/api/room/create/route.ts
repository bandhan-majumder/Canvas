import { createRoomWithElements } from "@/lib/db/queries";
import { NextResponse } from "next/server";

const requests = new Map<string, { count: number; firstRequest: number }>();

function rateLimit(limit: number, interval: number) {
    return (ip: string): boolean => {
        if (!requests.has(ip)) {
            requests.set(ip, { count: 0, firstRequest: Date.now() });
        }

        const data = requests.get(ip)!;

        if (Date.now() - data.firstRequest > interval) {
            data.count = 0;
            data.firstRequest = Date.now();
        }

        data.count += 1;

        if (data.count > limit) {
            return false; // Rate limit exceeded
        }

        requests.set(ip, data);
        return true; 
    };
}

const checkRateLimit = rateLimit(5, 60000); // 5 rooms per minute

function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    const realIp = request.headers.get("x-real-ip");
    if (realIp) {
        return realIp.trim();
    }

    return "unknown";
}

setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requests.entries()) {
        if (now - data.firstRequest > 60000) {
            requests.delete(ip);
        }
    }
}, 60000);

export async function POST(request: Request) {
    try {
        const clientIP = getClientIP(request);

        if (!checkRateLimit(clientIP)) {
            return NextResponse.json(
                { message: "Too many requests, please try again later." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { savedElements, userName } = body;

        const roomId = await createRoomWithElements({ savedElements, userName });

        if (!roomId) {
            return NextResponse.json(
                { error: "Failed to create room" },
                { status: 500 }
            );
        }

        return NextResponse.json({ roomId });
    } catch (error) {
        console.error("Error in create room API:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
