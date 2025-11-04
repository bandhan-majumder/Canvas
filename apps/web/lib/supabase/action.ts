import { importFromLocalStorage } from "@/hooks/use-localstorage";
import { supabase } from "@/lib/supabase/supbase-client"
import { CanvasElement } from "@/types/shape";

export async function createRoomWithElements(): Promise<string | null> {
    const { savedElements } = importFromLocalStorage();
    try {
        const { data } = await supabase
            .from('rooms')
            .insert({
                elements: JSON.stringify(savedElements)
            }).select('id');

        if (data && data[0].id) {
            return data[0].id;
        } else {
            return null;
        }
    } catch (error: unknown) {
        console.log("Error creating room: ", error);
        return null;
    }
}

export async function getElementsByRoomId(roomId: string): Promise<CanvasElement[] | null> {
    try {
        const { data } = await supabase
            .from('rooms')
            .select('elements')
            .eq('id', roomId)
            .single();

        if (data && data.elements) {
            const parsedElements = JSON.parse(JSON.parse(data.elements));
            return parsedElements as CanvasElement[];
        } else {
            return null;
        }
    } catch (error: unknown) {
        console.log("Error fetching elements: ", error);
        return null;
    }
}