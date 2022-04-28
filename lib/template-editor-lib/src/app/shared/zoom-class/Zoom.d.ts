export declare class Zoom {
    private zoomSubject;
    zoomObserver: import("rxjs").Observable<undefined>;
    makeZoom(e: WheelEvent, zoomRef: {
        value: number;
    }): void;
    zoomIn(zoomRef: {
        value: number;
    }): void;
    zoomOut(zoomRef: {
        value: number;
    }): void;
    zoomNormal(zoomRef: {
        value: number;
    }): void;
}
