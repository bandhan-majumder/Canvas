"use client";

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
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function ShareSessionModal() {
  const router = useRouter();
  const pathname = usePathname();
  const appUsernameAtom = useSetAtom(addUsernameAtom);

  const [isOwner, setIsOwner] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [clickedShared, setClickedShared] = useState(false);
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
        const response = await axios.get(
          `/api/room/${roomId}/owner?username=${userName}`,
        );
        const isRoomShared = response.data.isOwner;
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
    setClickedShared(true);
    let finalUsername = userName;

    if (!userName) {
      const randomUsername = generateRandomUsername();
      appUsernameAtom(randomUsername);
      finalUsername = randomUsername;
    }

    try {
      const response = await axios.post("/api/room/create", {
        savedElements,
        userName: finalUsername,
      });

      const newRoomId = response.data.roomId;

      if (newRoomId) {
        const shareUrl = `${window.location.origin}/room/${newRoomId}`;

        // to avoid the document not focused problem while copying text
        await window.focus();
        await navigator.clipboard.writeText(shareUrl);

        toast.success("URL copied to your clipboard!");
        router.push(`/room/${newRoomId}`);
      } else {
        toast.error("Failed to create a session. Please try again later!");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create a session. Please try again later!");
    } finally {
      setClickedShared(false);
    }
  }

  if (isLoading) {
    return null;
  }

  // User is in a room, is owner, and already sharing
  if (roomId && isOwner && isShared) {
    return (
      <Button variant="default" className="bg-[#B2AEFF] text-black" disabled>
        Sharing..
      </Button>
    );
  }

  // User is local (no roomId) OR is owner but not sharing
  if (!roomId || (roomId && isOwner && !isShared)) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="bg-[#B2AEFF] text-black" disabled={clickedShared}>
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
