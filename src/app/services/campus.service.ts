/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";

import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { Campus } from "../model/Campus";

@Injectable({
  providedIn: "root",
})
export class CampusService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllCampuses: "config.campus.getAll",
    addCampus: "config.campus.create",
    updateCampus: "config.campus.update",
    deleteCampus: "config.campus.delete",
    createBuilding: "config.campus.createBuilding",
    updateBuilding: "config.campus.updateBuilding",
    deleteBuilding: "config.campus.deleteBuilding",
    createFloor: "config.campus.createFloor",
    updateFloor: "config.campus.updateFloor",
    deleteFloor: "config.campus.deleteFloor",
    uploadFloorMap: "config.campus.uploadFloorMap",
    deleteFloorMap: "config.campus.deleteFloorMap",
    updateFloorMap: "config.campus.updateFloorMap",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  campuses = coreSignal<Campus[]>([]);

  getAllCampuses(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllCampuses);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.campuses.setValue(await Campus.createFromArray(apiCall.response.data));
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

  addCampus(
    {
      name,
      campusCode,
      address,
      blockNo,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude,
      contactEmail,
      contactPhone,
      buildings,
    }: {
      name: string;
      campusCode: string;
      address: string;
      blockNo: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      latitude: string;
      longitude: string;
      contactEmail: string;
      contactPhone: string;
      buildings?: any;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addCampus);
    apiCall.loader = loader;
    const data = {
      name,
      campusCode,
      address,
      blockNo,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude,
      contactEmail,
      contactPhone,
      buildings,
    };
    if (buildings) {
      data.buildings = buildings;
    }
    apiCall.data = data;
    // apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateCampus(
    {
      id,
      name,
      campusCode,
      address,
      blockNo,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude,
      contactEmail,
      contactPhone,
      buildings,
    }: {
      id: number;
      name: string;
      campusCode: string;
      address: string;
      blockNo: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      latitude: string;
      longitude: string;
      contactEmail: string;
      contactPhone: string;
      buildings?: any;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateCampus);
    apiCall.loader = loader;
    const data: any = {
      id,
      name,
      campusCode,
      address,
      blockNo,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude,
      contactEmail,
      contactPhone,
      buildings,
    };
    if (buildings) {
      data.buildings = buildings;
    }
    apiCall.data = data;
    // apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteCampus(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteCampus);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }

  createBuilding(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.createBuilding);
    apiCall.loader = loader;
    apiCall.data = payload;
    apiCall.exe().subscribe();
    return apiCall;
  }

  addBuilding(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.createBuilding);
    apiCall.loader = loader;
    apiCall.data = payload;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateBuilding(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateBuilding);
    apiCall.loader = loader;
    apiCall.data = payload;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteBuilding(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteBuilding);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }

  private compressFloorMapData(floorMapData: Omit<any, "imageUrl">): Omit<any, "imageUrl"> {
    const compressedData = { ...floorMapData };

    // Optimize polygons by reducing precision for coordinates
    // if (compressedData.polygons) {
    //   compressedData.polygons = compressedData.polygons.map(polygon => ({
    //     ...polygon,
    //     points: polygon.points.map(point => ({
    //       x: Math.round(point.x * 100) / 100, // Round to 2 decimal places
    //       y: Math.round(point.y * 100) / 100,
    //       lat: point.lat ? Math.round(point.lat * 1000000) / 1000000 : undefined, // Round to 6 decimal places for GPS
    //       lng: point.lng ? Math.round(point.lng * 1000000) / 1000000 : undefined,
    //     })),
    //     // Remove empty properties to reduce size
    //     properties: Object.fromEntries(Object.entries(polygon.properties).filter(([key, value]) => value !== null && value !== undefined && value !== "")),
    //   }));
    // }

    // Optimize geo markers
    // if (compressedData.geoMarkers) {
    //   compressedData.geoMarkers = compressedData.geoMarkers.map(marker => ({
    //     ...marker,
    //     lat: Math.round(marker.lat * 1000000) / 1000000,
    //     lng: Math.round(marker.lng * 1000000) / 1000000,
    //     // Remove empty properties
    //     properties: Object.fromEntries(Object.entries(marker.properties).filter(([_key, value]) => value !== null && value !== undefined && value !== "")),
    //   }));
    // }

    // Optimize calibration data
    // if (compressedData.calibration?.points) {
    //   compressedData.calibration.points = compressedData.calibration.points.map(point => ({
    //     ...point,
    //     imageCoords: {
    //       x: Math.round(point.imageCoords.x * 100) / 100,
    //       y: Math.round(point.imageCoords.y * 100) / 100,
    //     },
    //     geoCoords: {
    //       lat: Math.round(point.geoCoords.lat * 1000000) / 1000000,
    //       lng: Math.round(point.geoCoords.lng * 1000000) / 1000000,
    //     },
    //   }));
    // }

    return compressedData;
  }

  uploadFloorMap(id: number, imageUrl: File, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.uploadFloorMap);
    apiCall.loader = loader;
    apiCall.data = { floorId: id, file: imageUrl };
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteFloorMap(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteFloorMap);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }

  async updateFloorMap(id: number, floorMapGeometry: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateFloorMap);
    apiCall.loader = loader;

    apiCall.data = {
      id,
      floorMapGeometry: this.compressFloorMapData(floorMapGeometry),
    };

    apiCall.subject.subscribe({
      next: () => {
        if (apiCall.response?.status === "OK") {
          this.alertService.success("Floor map updated successfully");
        } else if (apiCall.response?.status === "FAILED") {
          this.alertService.error(apiCall.response.message || "Failed to update floor map");
        }
      },
      error: (err: any) => {
        if (err.status === 413) {
          this.alertService.error("Floor map data is too large. Please reduce image size or complexity.");
        } else {
          this.alertService.error(err.message || "Failed to update floor map");
        }
      },
    });

    apiCall.exe().subscribe();
    return apiCall;
  }

  addFloor(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.createFloor);
    apiCall.loader = loader;
    apiCall.data = payload;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateFloor(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateFloor);
    apiCall.loader = loader;
    apiCall.data = payload;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteFloor(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteFloor);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
}
