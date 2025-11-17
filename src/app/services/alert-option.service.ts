import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { AlertOption } from "../model/AlertOption";

@Injectable({
  providedIn: "root",
})
export class AlertOptionService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllAlertOptions: "config.alertOption.getAll",
    addAlertOption: "config.alertOption.create",
    updateAlertOption: "config.alertOption.update",
    deleteAlertOption: "config.alertOption.delete",
  };

  alertOptions = coreSignal<AlertOption[]>([]);

  getAllAlertOptions(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllAlertOptions);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.alertOptions.setValue(apiCall.response.data);
          return;
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async (err: Error) => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });

    apiCall.exe().subscribe();

    return apiCall;
  }

  addAlertOption({ name }: { name: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.addAlertOption);
    apiCall.data = { name };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateAlertOption({ id, name }: { id: number; name: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateAlertOption);
    apiCall.data = { id, name };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteAlertOption({ id }: { id: number }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteAlertOption);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
