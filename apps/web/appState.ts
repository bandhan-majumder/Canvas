import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils';
import { CanvasElement } from '@/types/shape';
import { STORAGE_KEYS } from '@/lib/constants';

export const localStorageElementsAtom = atomWithStorage<CanvasElement[]>(
  STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS,
  [] // default value
);

export const addShapeAtom = atom(
  null, // no read
  (get, set, newShape: CanvasElement) => {
    const currentShapes = get(localStorageElementsAtom);
    set(localStorageElementsAtom, [...currentShapes, newShape]);
  }
);

export const clearShapesAtom = atom(
  null,
  (get, set) => {
    set(localStorageElementsAtom, []);
  }
);