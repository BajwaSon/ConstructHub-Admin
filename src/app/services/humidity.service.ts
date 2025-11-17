/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { Humidity } from "../model/Humidity";
import { Watches } from "../model/Watches";

@Injectable({
  providedIn: "root",
})
export class HumidityService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllHumidity: "iot.humidity.getAll",
    addHumidity: "iot.humidity.create",
    updateHumidity: "iot.humidity.update",
    deleteHumidity: "iot.humidity.delete",
    updateHumidityMarkerMatrix: "iot.humidity.updateMarkerMatrix",
  };

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  humidity = coreSignal<Humidity[]>([]);
  getAllHumidity(loader = new RequestLoader(), floorId?: number) {
    const apiCall = this.apiService.apiCall(this.api.getAllHumidity);
    apiCall.loader = loader;
    if (floorId) {
      apiCall.params = { floorId: floorId };
    }
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.humidity.setValue(await Watches.createFromArray(apiCall.response.data));
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

  addHumidity(
    {
      macId,
      latitude,
      longitude,
      // campusId,
      // buildingId,
      floorId,
    }: {
      macId: string;
      latitude: string;
      longitude: string;
      // campusId: number;
      // buildingId: number;
      floorId: number;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addHumidity);
    apiCall.loader = loader;
    const data: any = { macId, latitude, longitude, floorId };
    // if (campusId) data.campusId = campusId;
    // if (buildingId) data.buildingId = buildingId;
    if (floorId) data.floorId = floorId;
    apiCall.data = data;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateHumidity(
    {
      id,
      macId,
      latitude,
      longitude,
      // campusId,
      // buildingId,
      floorId,
    }: {
      id: string;
      macId: string;
      latitude: string;
      longitude: string;
      // campusId: string;
      // buildingId: string;
      floorId: string;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateHumidity);
    apiCall.loader = loader;
    const data: any = { id, macId, latitude, longitude, floorId };
    // if (campusId) data.campusId = campusId;
    // if (buildingId) data.buildingId = buildingId;
    if (floorId) data.floorId = floorId;
    apiCall.data = data;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteHumidity(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteHumidity);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateHumidityMarkerMatrix(humidityPayload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateHumidityMarkerMatrix);
    apiCall.loader = loader;
    apiCall.data = humidityPayload;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
