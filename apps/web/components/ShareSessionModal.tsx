import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createRoomWithElements } from "@/lib/supabase/action"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function ShareSessionModal() {
  const router = useRouter();

  async function onShareHandler(): Promise<void> {
    const newRoomId = await createRoomWithElements();
    if (newRoomId) {
      navigator.clipboard.writeText(`canvas.bandhanmajumder.com/room/${newRoomId}`);
      toast.success("URL copied to your clipboard!")
      router.push(`/room/${newRoomId}`);
    } else {
      toast.error("Failed to create a session. Please try again later!")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-[#B2AEFF] text-black">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#303030] text-white border-gray-100 outline-none">
        <DialogHeader>
          <DialogTitle>You are sharing a session!</DialogTitle>
          <DialogDescription>
            People whom you share this link, will be able to collaborate with you in this canvas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <div className="flex gap-5">
              <Button type="button" variant="secondary" className="outline-none border-none">
                Close
              </Button>
              <Button type="button" variant="destructive" className="bg-[#B2AEFF] text-black" onClick={onShareHandler}>
                Confirm
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
