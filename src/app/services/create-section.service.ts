/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";

import { AlertService, ApiService, coreSignal } from "@jot143/core-angular";
import { Section } from "../model/Section";
import { Child } from "../model/Child";
import { RequestLoader } from "@jot143/core-angular";

@Injectable({
  providedIn: "root",
})
export class CreateSectionService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllSections: "master.section.getAll",
    getChilds: "master.child.getAll",
    getChildsByClassLevelId: "master.child.getByClassLevelId",
    addSection: "school.classSection.create",
    updateSection: "school.classSection.update",
    deleteSection: "school.classSection.delete",
    bindStudentsWithClassSection: "school.classSection.classSectionMapWithStudents",
    unbindStudentsFromClassSection: "school.classSection.classSectionUnmapWithStudents",
  };

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  sections = coreSignal<Section[]>([]);
  childs = coreSignal<any[]>([]);
  childsByClassLevelId = coreSignal<Child[]>([]);

  getChildsByClassLevelId(classLevelId: any) {
    if (!classLevelId) return;
    const apiCall = this.apiService.apiCall(this.api.getChildsByClassLevelId);
    apiCall.data = { classLevelId };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.childsByClassLevelId.setValue(await Child.createFromArray(apiCall.response.data));
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
  // getClassSectionByClassLevelId(classLevelId: any) {
  //   const apiCall = this.apiService.apiCall(this.api.getClassSectionByClassLevelId);
  //   apiCall.data = { classLevelId };
  //   apiCall.subject.subscribe({
  //     next: async () => {
  //       if (apiCall.response?.status === "OK") {
  //         this.sections.setValue(await Section.createFromArray(apiCall.response.data));
  //         return;
  //       } else {
  //         this.alertService.error(apiCall.response.message || "Something went wrong");
  //       }
  //     },
  //     error: async (err: Error) => {
  //       this.alertService.error(err.message);
  //     },
  //   });

  //   apiCall.exe().subscribe();

  //   return apiCall;
  // }
  getAllSections() {
    const apiCall = this.apiService.apiCall(this.api.getAllSections);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.sections.setValue(await Section.createFromArray(apiCall.response.data));
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

  getChilds() {
    const apiCall = this.apiService.apiCall(this.api.getChilds);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.childs.setValue(await Child.createFromArray(apiCall.response.data));
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

  addSection(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.addSection);
    apiCall.loader = loader;
    apiCall.data = payload;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateSection(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateSection);
    apiCall.loader = loader;
    apiCall.data = payload;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteSection(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteSection);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
  bindStudentsWithClassSection({ studentIds, classSectionId }: { studentIds: any; classSectionId: string[] }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.bindStudentsWithClassSection);
    apiCall.data = { studentIds, classSectionId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  unbindStudentsFromClassSection({ studentIds, classSectionId }: { studentIds: any; classSectionId: string[] }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.unbindStudentsFromClassSection);
    apiCall.data = { studentIds, classSectionId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
