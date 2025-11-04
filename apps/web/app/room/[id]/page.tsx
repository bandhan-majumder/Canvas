import Canvas from "@/components/Canvas";
import { getElementsByRoomId } from "@/lib/supabase/action";
import React from "react";

type Props = {
    params: Promise<{ id: string }>
}

export default async function Home({ params }: Props) {
    const param = await params;
    const elements = await getElementsByRoomId(param.id);

    return (
        <div className="h-full w-full bg-[#111011]">
            <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
                <Canvas prevElements={elements || []} />
            </div>
        </div>
    );
}
