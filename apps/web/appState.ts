import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CanvasElement } from "@/types/shape";
import { CanvasViewState } from "@/types/view";
import { STORAGE_KEYS } from "@/lib/constants";

export const localStorageElementsAtom = atomWithStorage<CanvasElement[]>(
  STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS,
  [], // default value
);

export const localStorageUsernameAtom = atomWithStorage<string>(
  STORAGE_KEYS.LOCAL_STORAGE_USERNAME,
  "", // default value
);

export const canvasViewStateAtom = atomWithStorage<CanvasViewState>(
  STORAGE_KEYS.LOCAL_STORAGE_CANVAS_VIEW,
  {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  }
);

export const addUsernameAtom = atom(
  null, // no read
  (get, set, username: string) => {
    set(localStorageUsernameAtom, username);
  },
);

// support for both single shape and multiple shapes
export const addShapesAtom = atom(
  null, // no read
  (get, set, newShapes: CanvasElement | CanvasElement[]) => {
    if (Array.isArray(newShapes)) {
      set(localStorageElementsAtom, [...newShapes]);
      // replace with the new shapes entirely. I should replace any existing content that is not in the database but in localStorage
      return;
    } else {
      const currentShapes = get(localStorageElementsAtom);
      set(localStorageElementsAtom, [...currentShapes, newShapes]);
    }
  },
);

export const replaceShapesAtom = atom(
  null,
  (get, set, shapes: CanvasElement[]) => {
    set(localStorageElementsAtom, shapes);
  },
);

export const clearShapesAtom = atom(null, (get, set) => {
  set(localStorageElementsAtom, []);
});

export const clearUsernameAtom = atom(null, (get, set) => {
  set(localStorageUsernameAtom, "");
});

export const updateCanvasViewAtom = atom(
  null,
  (get, set, viewState: CanvasViewState) => {
    set(canvasViewStateAtom, viewState);
  },
);