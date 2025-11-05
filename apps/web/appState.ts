import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CanvasElement } from '@/types/shape';
import { STORAGE_KEYS } from '@/lib/constants';

export const localStorageElementsAtom = atomWithStorage<CanvasElement[]>(
  STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS,
  [] // default value
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
  }
);

export const replaceShapesAtom = atom(
  null,
  (get, set, shapes: CanvasElement[]) => {
    set(localStorageElementsAtom, shapes);
  }
);

export const clearShapesAtom = atom(
  null,
  (get, set) => {
    set(localStorageElementsAtom, []);
  }
);