/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { Bus } from "../model/Bus";
import { Child } from "../model/Child";

@Injectable({
  providedIn: "root",
})
export class BusService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllBuses: "config.bus.getAll",
    getAllBusesById: "config.bus.getById",
    getAllChildByBusId: "config.bus.getByBusId",
    addBus: "config.bus.create",
    updateBus: "config.bus.update",
    deleteBus: "config.bus.delete",
    bindStudentsWithBus: "config.bus.bindChild",
    unbindStudentsFromBus: "config.bus.unbindChild",
  };

  busTypeOptions = [
    { value: "standard", label: "Standard" },
    { value: "deluxe", label: "Deluxe" },
    { value: "premium", label: "Premium" },
  ];

  statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  buses = coreSignal<Bus[]>([]);
  busById = coreSignal<Bus | null>(null);
  childByBusId = coreSignal<Child[]>([]);

  getAllBuses(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllBuses);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.buses.setValue(apiCall.response.data);
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
  getChildByBusId(id: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllChildByBusId);
    apiCall.data = { busId: id };
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.childByBusId.setValue(apiCall.response.data);
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
  bindStudentsWithBus({ childIds, busId }: { childIds: any; busId: string[] }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.bindStudentsWithBus);
    apiCall.data = { childIds, busId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  unbindStudentsFromBus({ childIds, busId }: { childIds: any; busId: string[] }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.unbindStudentsFromBus);
    apiCall.data = { childIds, busId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  getAllBusesById(id: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllBusesById);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.busById.setValue(apiCall.response.data);
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

  addBus(
    { busNumber, busType, capacity, status }: { busNumber: string; busType: string; capacity: number; status: "active" | "inactive" | "maintenance" },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addBus);
    apiCall.data = { busNumber, busType, capacity, status };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateBus(
    { id, busNumber, busType, capacity, status }: { id: string; busNumber: string; busType: string; capacity: number; status: "active" | "inactive" | "maintenance" },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateBus);
    apiCall.data = { id, busNumber, busType, capacity, status };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteBus(id: string, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteBus);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
