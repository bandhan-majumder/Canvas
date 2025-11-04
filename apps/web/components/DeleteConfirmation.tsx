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
        <Button variant="destructive" className="bg-red-600">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black text-white border-gray-100 outline-none">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            All of your drawings will be lost if you click the delet button.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <div>
              <Button type="button" variant="secondary">
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
