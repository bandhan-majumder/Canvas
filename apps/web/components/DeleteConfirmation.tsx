import { clearShapesAtom } from "@/appState"
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
import { useSetAtom } from "jotai"

export function DeleteCanvasElements() {
  const clearAllShapes = useSetAtom(clearShapesAtom)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#303030] text-white border-gray-100 outline-none">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            All of your drawings will be lost if you confirm to delete.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <div className="flex gap-5">
              <Button type="button" variant="secondary" className="outline-none border-none">
                Close
              </Button>
              <Button type="button" variant="destructive" className="bg-red-600" onClick={clearAllShapes}>
                Confirm
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
