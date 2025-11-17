/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { Classroom } from "../model/ClassRoom";
import { Gateway } from "../model/Gateway";

@Injectable({
  providedIn: "root",
})
export class GatewayService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllGateway: "iot.gateway.getAll",
    addGateway: "iot.gateway.create",
    updateGateway: "iot.gateway.update",
    deleteGateway: "iot.gateway.delete",
    updateGatewayMarkerMatrix: "iot.gateway.updateMarkerMatrix",
  };

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;

  gateway = coreSignal<Gateway[]>([]);
  gatewayByFloorId = coreSignal<Classroom[]>([]);

  getAllGateway(loader = new RequestLoader(), floorId?: number) {
    const apiCall = this.apiService.apiCall(this.api.getAllGateway);
    if (floorId) {
      apiCall.params = { floorId: floorId };
    }
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.gateway.setValue(await Gateway.createFromArray(apiCall.response.data));
          console.log(this.gateway());
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

  addGateway(
    {
      macId,
      latitude,
      longitude,
      floorId,
      classRoomId,
    }: {
      macId: string;
      latitude: string;
      longitude: string;
      campusId: number;
      buildingId: number;
      floorId: number;
      classRoomId?: number;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addGateway);
    const data: any = { macId, latitude, longitude, floorId };
    if (classRoomId) data.classRoomId = classRoomId;
    apiCall.data = data;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateGateway(
    {
      id,
      macId,
      latitude,
      longitude,
      classRoomId,
      floorId,
    }: {
      id: string;
      macId: string;
      latitude: string;
      longitude: string;
      classRoomId?: number | null;
      floorId: number | null;
      markerMatrix: any;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateGateway);
    const data: any = { id, macId, latitude, longitude, floorId };
    if (classRoomId) data.classRoomId = classRoomId;
    apiCall.data = data;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteGateway(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteGateway);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateGatewayMarkerMatrix(gateway: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateGatewayMarkerMatrix);
    apiCall.data = gateway;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
