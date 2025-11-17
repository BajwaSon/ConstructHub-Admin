/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertService, ApiService, coreSignal } from "@jot143/core-angular";
import { Student } from "../model/Student";
import { RequestLoader } from "@jot143/core-angular";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  addDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  updateDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  api = {
    getAllStudents: "master.student.getAll",
    addStudent: "master.child.create",
    updateStudent: "master.child.update",
    deleteStudent: "master.child.delete",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  students = coreSignal<Student[]>([]);
  getAllStudents() {
    const apiCall = this.apiService.apiCall(this.api.getAllStudents);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.students.setValue(await Student.createFromArray(apiCall.response.data));
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

  addStudent(
    {
      referenceId,
      classLevelId,
      firstName,
      middleName,
      lastName,
      gender,
      origin,
      file,
      parent,
    }: {
      referenceId: string;
      classLevelId: string;
      firstName: string;
      middleName: string;
      lastName: string;
      origin: string;
      gender: string;
      file: File;
      parent: Array<{
        firstName?: string;
        middleName?: string;
        lastName?: string;
        address?: string;
        phoneNo?: string;
        email?: string;
        relation?: string;
      }>;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addStudent);
    apiCall.loader = loader;
    const requestData = {
      referenceId,
      classLevelId,
      firstName,
      middleName,
      lastName,
      origin,
      gender,
      file,
      parent: JSON.stringify(parent),
    };

    apiCall.data = requestData;
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateStudent(
    {
      id,
      referenceId,
      classLevelId,
      firstName,
      middleName,
      lastName,
      origin,
      gender,
      parent,
      file,
    }: {
      id: number;
      referenceId: string;
      classLevelId: string;
      firstName: string;
      middleName: string;
      lastName: string;
      origin: string;
      gender: string;
      parent: Array<{
        firstName?: string;
        middleName?: string;
        lastName?: string;
        address?: string;
        phoneNo?: string;
        email?: string;
        relation?: string;
      }>;
      file?: File;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateStudent);
    apiCall.loader = loader;
    const data: any = { id, referenceId, classLevelId, firstName, middleName, lastName, origin, gender, parent: JSON.stringify(parent) };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteStudent(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteStudent);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
}
