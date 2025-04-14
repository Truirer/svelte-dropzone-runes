import type { DropzoneAreaEvents } from "./types.js";
const useDropzone = (element: HTMLElement | undefined, events: DropzoneAreaEvents) => {

    if (!element) return () => { }

    (Object.entries(events) as [keyof DropzoneAreaEvents, EventListener | null][])
        .forEach(([eventName, handler]) => {
            if (handler) {
                element.addEventListener(eventName, handler);
            }
        });

    return () => {
        (Object.entries(events) as [keyof DropzoneAreaEvents, EventListener | null][])
            .forEach(([eventName, handler]) => {
                if (handler) {
                    element.removeEventListener(eventName, handler);
                }
            });
    }
};
export default useDropzone