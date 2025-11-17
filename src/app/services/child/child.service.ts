import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal } from "@jot143/core-angular";
import { Child } from "../../model/Child";

@Injectable({
  providedIn: "root",
})
export class ChildService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);
  private childData = coreSignal([]);

  getChildDetail(child: Child) {
    const apiCall = this.apiService.apiCall("parent.child.get", `child-${child.id}`);
    apiCall.params = { childId: child.id };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.childData.setValue(apiCall.response.data);
          await child.set(apiCall.response.data);
          child.populated.next(true);
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async err => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });

    apiCall.exe().subscribe();
  }
}
