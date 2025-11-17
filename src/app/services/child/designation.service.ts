import { inject, Injectable } from "@angular/core";
import { ApiService, AlertService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { DesignationOption } from "../../model/DesignationOption";

@Injectable({
  providedIn: "root",
})
export class DesignationService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  designationOptions = coreSignal<DesignationOption[]>([]);

  getAllDesignationOptions() {
    const apiCall = this.apiService.apiCall("master.staff.getRoles");
    apiCall.subject.subscribe({
      next: () => {
        if (apiCall.response?.status === "OK") {
          this.designationOptions.setValue(apiCall.response.data);
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: (err: Error) => {
        this.alertService.error(err.message);
      },
    });
    apiCall.exe().subscribe();
    return apiCall;
  }

  addDesignationOption({ designation }: { designation: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall("master.staff.createRole");
    apiCall.data = { designation };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateDesignationOption({ id, designation }: { id: number; designation: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall("master.staff.updateRole");
    apiCall.data = { id, designation };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteDesignationOption({ id }: { id: number }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall("master.staff.deleteRole");
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
