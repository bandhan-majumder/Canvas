import { importFromLocalStorage } from "@/hooks/use-localstorage";
import { supabase } from "@/lib/supabase/supbase-client"
import { CanvasElement } from "@/types/shape";

export async function createRoomWithElements(): Promise<string | null> {
    const { savedElements } = importFromLocalStorage();
    try {
        const { data,error } = await supabase
            .from('rooms')
            .insert({
                elements: JSON.stringify(savedElements)
            }).select('id');

        if (error){
            throw new Error(error.message);
        }
        
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
        const { data, error } = await supabase
            .from('rooms')
            .select('elements')
            .eq('id', roomId)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        if (data && data.elements) {
            const elementsRaw = data.elements as unknown;
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
                console.log("Error parsing elements: ", err);
                return null;
            }
        } else {
            return null;
        }
    } catch (error: unknown) {
        console.log("Error fetching elements: ", error);
        throw new Error("Room not found");
    }
}