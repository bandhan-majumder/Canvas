import { CanvasElement } from '@/types/shape';
import { supabase } from '@/lib/supabase/supbase-client';

interface createRoomProps {
  savedElements: CanvasElement[],
  userName: string | null
}
export async function createRoomWithElements({
  savedElements, userName
}: createRoomProps): Promise<string | null> {
  if (!userName) {
    throw new Error("Username is not generated!")
  };

  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        elements: JSON.stringify(savedElements),
        randomUsername: userName,
        isShared: true
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
        console.error("Error creating room: ", error);
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
                console.error("Error parsing elements: ", err);
                return null;
            }
    }
    
    return null;
  } catch (error: unknown) {
    console.error('Error fetching elements:', error);
    throw new Error('Room not found');
  }
}

// Update room elements
export async function updateRoomElements(
  roomId: string,
  elements: CanvasElement[]
): Promise<void> {
  try {
    const { error } = await supabase
      .from('rooms')
      .update({
        elements: JSON.stringify(elements),
      })
      .eq('id', roomId);

    if (error) {
      throw new Error(`Failed to update room: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating room elements:', error);
    throw error;
  }
}

// Check if room exists
export async function roomExists(roomId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('id')
      .eq('id', roomId)
      .single();

    return !error && data !== null;
  } catch {
    return false;
    }
}

// Check if user is the room owner or not and it's on shared state or not
export async function isRoomOwner(roomId: string, username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('isShared')
      .eq('id', roomId)
      .eq('randomUsername', username)
      .single();

    if (error) {
      throw new Error(`User not room owner: ${error.message}`);
    }

    return data ? data.isShared : false;
  } catch (error) {
    console.error('Error checking if room is shared:', error);
    throw error;
  }
}

export async function stopSharingRoom(roomId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('rooms')
      .update({
        isShared: false
      }).eq('id', roomId)

    if (error) {
      throw new Error(`Failed to update room: ${error.message}`);
    }
  } catch (error) {
    console.error('Failed to update room: ', error);
    throw error;
  }
}

// Check if user is the room owner or not and it's on shared state or not
export async function isRoomSharing(roomId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('isShared')
      .eq('id', roomId)
      .single();

    if (error) {
      throw new Error(`Error finding shared room: ${error.message}`);
    }

    return data ? data.isShared : false;
  } catch (error) {
    console.error('Error checking if room is shared:', error);
    throw error;
    }
}