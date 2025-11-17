/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";

import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { ClassSection } from "../model/ClassSection";

@Injectable({
  providedIn: "root",
})
export class ClassSectionService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllClassSections: "school.classSection.getAll",
    addClassSection: "school.classSection.create",
    updateClassSection: "school.classSection.update",
    deleteClassSection: "school.classSection.delete",
    getByClassLevel: "school.classSection.getByClassLevel",
    getByClassSectionId: "master.child.getByClassSectionId",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  classSections = coreSignal<ClassSection[]>([]);
  classSectionsByClassLevel = coreSignal<ClassSection[]>([]);
  classSectionById = coreSignal<ClassSection[]>([]);

  getByClassLevel(classLevelId: number, loader = new RequestLoader()) {
    if (!classLevelId) return;
    const apiCall = this.apiService.apiCall(this.api.getByClassLevel);
    apiCall.loader = loader;
    apiCall.data = { id: classLevelId };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.classSectionsByClassLevel.setValue(await ClassSection.createFromArray(apiCall.response.data));
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

  getByClassSectionId(classSectionId: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getByClassSectionId);
    apiCall.loader = loader;
    apiCall.data = { classSectionId };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          let classSection: any = await ClassSection.createFromArray(apiCall.response.data);

          const positions = [
            { lat: 24.4371852, lng: 54.400173, altitude: 2.2 },
            { lat: 24.4371952, lng: 54.400173, altitude: 2.2 },
            { lat: 24.4372095, lng: 54.400175, altitude: 2.2 },

            { lat: 24.4372095, lng: 54.400185, altitude: 2.2 },
            { lat: 24.4371881, lng: 54.400194, altitude: 2.2 },
            { lat: 24.4371985, lng: 54.400193, altitude: 2.2 },

            { lat: 24.4372098, lng: 54.400212, altitude: 2.2 },
            { lat: 24.4372115, lng: 54.400225, altitude: 2.2 },
            { lat: 24.4371882, lng: 54.400229, altitude: 2.2 },

            { lat: 24.436926, lng: 54.400153, altitude: 3 }, //  { x: 24.7, y: 22.9, z: 2.2 },
          ];

          classSection = classSection.map((section: any, index: number) => {
            section.mapPosition = positions[index];
            return section;
          });

          this.classSectionById.setValue(classSection);
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

  getAllClassSections(loader = new RequestLoader(), classLevelId?: number) {
    const apiCall = this.apiService.apiCall(this.api.getAllClassSections);
    apiCall.loader = loader;
    if (classLevelId) {
      apiCall.params = { levelId: classLevelId };
    }
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.classSections.setValue(await ClassSection.createFromArray(apiCall.response.data));
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

  addClassSection(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.addClassSection);
    apiCall.loader = loader;
    apiCall.data = payload;
    // apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateClassSection(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateClassSection);
    apiCall.loader = loader;
    apiCall.data = payload;
    // apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteClassSection(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteClassSection);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
}
