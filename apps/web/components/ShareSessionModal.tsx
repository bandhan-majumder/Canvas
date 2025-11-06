import { addUsernameAtom, localStorageElementsAtom } from "@/appState";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { STORAGE_KEYS } from "@/lib/constants";
import { generateRandomUsername } from "@/lib/random-username";
import { createRoomWithElements, isRoomOwner } from "@/lib/supabase/action";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// interface ShareSessionModalProps {
//   onStopSharing?: () => void;
// }

export function ShareSessionModal() {
  const router = useRouter();
  const pathname = usePathname();
  const appUsernameAtom = useSetAtom(addUsernameAtom);

  const [isOwner, setIsOwner] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const savedElements = useAtomValue(localStorageElementsAtom);

  const roomId = pathname?.startsWith("/room/")
    ? pathname.split("/room/")[1]
    : undefined;

  // Load username from localStorage only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUsername = localStorage.getItem(
          STORAGE_KEYS.LOCAL_STORAGE_USERNAME,
        );
        setUserName(storedUsername || "");
      } catch (error) {
        console.error("Error reading username from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const checkIfOwnerAndShared = async () => {
      if (!roomId) {
        setIsOwner(false);
        setIsShared(false);
        setIsLoading(false);
        return;
      }

      if (!userName) {
        return;
      }

      try {
        const isRoomShared = await isRoomOwner(roomId, userName);
        setIsShared(isRoomShared);
        setIsOwner(true);
      } catch {
        setIsOwner(false);
        setIsShared(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkIfOwnerAndShared();
  }, [userName, roomId]);

  async function onShareHandler(): Promise<void> {
    let finalUsername = userName;

    if (!userName) {
      const randomUsername = generateRandomUsername();
      appUsernameAtom(randomUsername);
      finalUsername = randomUsername;
    }

    const newRoomId = await createRoomWithElements({
      savedElements,
      userName: finalUsername,
    });

    if (newRoomId) {
      const shareUrl = `${window.location.origin}/room/${newRoomId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("URL copied to your clipboard!");
      router.push(`/room/${newRoomId}`);
    } else {
      toast.error("Failed to create a session. Please try again later!");
    }
  }

  // async function onStopShareHandler(): Promise<void> {
  //   if (!roomId) return;

  //   try {

  //     onStopSharing?.();

  //     await stopSharingRoom(roomId);

  //     setIsShared(false);
  //     toast.success("Stopped sharing session. All collaborators disconnected.");

  //     setTimeout(() => {
  //       router.push('/');
  //     }, 500);
  //   } catch (error) {
  //     console.error('Error stopping share:', error);
  //     toast.error("Failed to stop sharing. Please try again.");
  //   }
  // }

  if (isLoading) {
    return null;
  }

  // User is in a room, is owner, and already sharing
  if (roomId && isOwner && isShared) {
    return (
      <div className="bg-[#B2AEFF] text-black">Sharing..</div>
      // <Dialog>
      //   <DialogTrigger asChild>
      //     <Button variant="default" className="bg-[#B2AEFF] text-black">Stop Sharing</Button>
      //   </DialogTrigger>
      //   <DialogContent className="sm:max-w-md bg-[#303030] text-white border-gray-100 outline-none">
      //     <DialogHeader>
      //       <DialogTitle>Stop sharing session?</DialogTitle>
      //       <DialogDescription>
      //         Once you stop sharing, all collaborators will be disconnected and the room will be cleared.
      //         Their work will be saved to their local storage.
      //       </DialogDescription>
      //     </DialogHeader>
      //     <DialogFooter className="sm:justify-start">
      //       <DialogClose asChild>
      //         <div className="flex gap-5">
      //           <Button type="button" variant="secondary">Close</Button>
      //           <Button type="button" variant="destructive" onClick={onStopShareHandler}>
      //             Confirm
      //           </Button>
      //         </div>
      //       </DialogClose>
      //     </DialogFooter>
      //   </DialogContent>
      // </Dialog>
    );
  }

  // User is local (no roomId) OR is owner but not sharing
  if (!roomId || (roomId && isOwner && !isShared)) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="bg-[#B2AEFF] text-black">
            Share
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-[#303030] text-white border-gray-100 outline-none">
          <DialogHeader>
            <DialogTitle>Share your session!</DialogTitle>
            <DialogDescription>
              People you share this link with will be able to collaborate on
              this canvas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="flex gap-5">
                <Button type="button" variant="secondary">
                  Close
                </Button>
                <Button
                  type="button"
                  className="bg-[#B2AEFF] text-black"
                  onClick={onShareHandler}
                >
                  Confirm
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
