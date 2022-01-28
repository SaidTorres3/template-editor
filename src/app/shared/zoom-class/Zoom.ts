import { Subject } from "rxjs";

export class Zoom {

  private zoomSubject = new Subject<undefined>();
  public zoomObserver = this.zoomSubject.asObservable();

  public makeZoom(e: WheelEvent, zoomRef: { value: number }) {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY;
      this.zoomSubject.next(undefined);
      if (delta < 0) {
        this.zoomIn(zoomRef);
      } else {
        this.zoomOut(zoomRef);
      }
    }
  }

  public zoomIn(zoomRef: { value: number }) {
    zoomRef.value < 2 ? (zoomRef.value += 0.1) : undefined;
  }

  public zoomOut(zoomRef: { value: number }) {
    zoomRef.value > 0.11 ? (zoomRef.value -= 0.1) : undefined;
  }

  public zoomNormal(zoomRef: { value: number }) {
    zoomRef.value = 1;
  }
}
