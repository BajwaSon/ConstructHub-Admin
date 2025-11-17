/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader, WritableCoreSignal } from "@jot143/core-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Nurse } from "../model/Nurse";
import { ClassLevel } from "../model/ClassLevel";

@Injectable({
  providedIn: "root",
})
export class ClassByLevelSchedulingService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllClassLevel: "school.classLevel.getAll",
    addClassLevel: "school.classLevel.create",
    updateClassLevel: "school.classLevel.update",
    deleteClassLevel: "school.classLevel.delete",

    getAllClassStudentByLevelId: "school.classLevel.getAllByStudent",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  classLevels = coreSignal<ClassLevel[]>([]);
  classStudentByLevelId = coreSignal<ClassLevel[]>([]);

  getAllClassLevels(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllClassLevel);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.classLevels.setValue(await ClassLevel.createFromArray(apiCall.response.data));
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
  getAllClassLevelIdByStudent(levelId: any) {
    const apiCall = this.apiService.apiCall(this.api.getAllClassStudentByLevelId);
    apiCall.data = { levelId };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.classStudentByLevelId.setValue(await ClassLevel.createFromArray(apiCall.response.data));
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

  addClassLevel({ name, description, gender, dob, designation, file }: { name: string; description: string; gender: string; dob: string; designation: string; file: File }) {
    const apiCall = this.apiService.apiCall(this.api.addClassLevel);
    apiCall.data = { name, description, gender, dob, designation, file };
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateClassLevel({
    id,
    name,
    description,
    gender,
    dob,
    designation,
    file,
  }: {
    id: number;
    name: string;
    description: string;
    gender: string;
    dob: string;
    designation: string;
    file?: File;
  }) {
    const apiCall = this.apiService.apiCall(this.api.updateClassLevel);
    const data: any = { id, name, description, gender, dob, designation };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteClassLevel(id: number) {
    const apiCall = this.apiService.apiCall(this.api.deleteClassLevel);
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
}
