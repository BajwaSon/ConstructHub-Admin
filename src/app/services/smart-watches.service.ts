/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { Watches } from "../model/Watches";

@Injectable({
  providedIn: "root",
})
export class SmartWatchService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  addDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  updateDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  api = {
    getAllWatches: "iot.watch.getAll",
    createWatch: "iot.watch.create",
    updateWatch: "iot.watch.update",
    bindWatch: "iot.watch.bind",
    deleteWatch: "iot.watch.delete",
  };

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  watches = coreSignal<Watches[]>([]);
  getAllWatches(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllWatches);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.watches.setValue(await Watches.createFromArray(apiCall.response.data));
          return;
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async (err: Error) => {
        this.alertService.error(err.message);
      },
    });

    apiCall.exe().subscribe();

    return apiCall;
  }

  addWatch({ macId, manufacturer, name, status }: { macId: any; manufacturer: string; name: string; status: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.createWatch);
    apiCall.data = { macId, manufacturer, name, status };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateWatch({ macId, manufacturer, name, status }: { macId: string; manufacturer: string; name: string; status: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateWatch);
    const data: any = { macId, manufacturer, name, status };
    apiCall.data = data;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteWatch(macId: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteWatch);
    apiCall.data = { macId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  bindWatch({ macId, childId }: { macId: any; childId: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.bindWatch);
    apiCall.data = { macId, childId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
