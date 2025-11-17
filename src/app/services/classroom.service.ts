/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";

import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { Classroom } from "../model/ClassRoom";

@Injectable({
  providedIn: "root",
})
export class ClassroomService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllClassrooms: "school.classRoom.getAll",
    addClassroom: "school.classRoom.create",
    updateClassroom: "school.classRoom.update",
    deleteClassroom: "school.classRoom.delete",
    updateClassroomGeometry: "school.classRoom.updateGeometry",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  classrooms = coreSignal<Classroom[]>([]);
  getAllClassrooms(loader = new RequestLoader(), floorId?: number) {
    const apiCall = this.apiService.apiCall(this.api.getAllClassrooms);
    if (floorId) {
      apiCall.params = { floorId: floorId };
    }
    apiCall.loader = loader;

    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.classrooms.setValue(await Classroom.createFromArray(apiCall.response.data));
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

  addClassroom(
    {
      // roomName,
      roomNumber,
      roomGeometry,
      roomGeoLocation,
      roomGatewayID,
      campusId,
      buildingId,
      floorId,
      // file,
    }: {
      // roomName: string;
      roomNumber: string;
      roomGeometry: string;
      roomGeoLocation: number;
      roomGatewayID: number;
      campusId: number;
      buildingId: number;
      floorId: number;
      // file: File;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addClassroom);
    apiCall.loader = loader;
    apiCall.data = { roomNumber, roomGeometry, roomGeoLocation, roomGatewayID, campusId, buildingId, floorId };
    // apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateClassroom(
    {
      id,
      roomNumber,
      roomGeometry,
      roomGeoLocation,
      roomGatewayID,
      campusId,
      buildingId,
      floorId,
      // file,
    }: {
      id: number;
      roomNumber: string;
      roomGeometry: string;
      roomGeoLocation: number;
      roomGatewayID: number;
      campusId: number;
      buildingId: number;
      floorId: number;
      // file: File;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateClassroom);
    apiCall.loader = loader;
    const data: any = { id, roomNumber, roomGeometry, roomGeoLocation, roomGatewayID, campusId, buildingId, floorId };
    // if (file) {
    //   data.file = file;
    // }
    apiCall.data = data;
    // apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteClassroom(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteClassroom);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }

  // Save classroom geometry (polygons/markers) to backend
  updateClassroomGeometry(id: string, geometry: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateClassroomGeometry);
    apiCall.loader = loader;
    apiCall.data = { id, roomGeometry: JSON.stringify(geometry) };
    return apiCall.exe();
  }
}
