import Canvas from "@/components/Canvas";
import { getElementsByRoomId } from "@/lib/supabase/action";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
    params: { id: string }
}

export default async function Home({ params }: Props) {
    let elements;
    try {
        elements = await getElementsByRoomId(params.id);
    } catch {
        // that room does not exist
        redirect("/")
    }

    return (
        <div className="h-full w-full bg-[#111011]">
            <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
                <Canvas prevElements={elements || []} />
            </div>
        </div>
    );
}
