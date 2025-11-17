import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MapTrackingService {
  private switchToTabSubject = new Subject<number>();
  switchToTab$ = this.switchToTabSubject.asObservable();

  switchToTab(tabIndex: number) {
    this.switchToTabSubject.next(tabIndex);
  }
}
