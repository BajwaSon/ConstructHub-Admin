/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal } from "@jot143/core-angular";
import { Student } from "../model/Student";

@Injectable({
  providedIn: "root",
})
export class HealthService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllStudentsHealth: "master.student.getAll",
    addStudentHealth: "master.student.create",
    updateStudentHealth: "master.student.update",
    deleteStudentHealth: "master.student.delete",
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
  getAllStudentsHealth() {
    const apiCall = this.apiService.apiCall(this.api.getAllStudentsHealth);
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

  addStudentHealth({
    firstName,
    middleName,
    lastName,
    email,
    phoneNo,
    gender,
    dob,
    designation,
    file,
  }: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    gender: string;
    dob: string;
    designation: string;
    file: File;
  }) {
    const apiCall = this.apiService.apiCall(this.api.addStudentHealth);
    apiCall.data = { firstName, middleName, lastName, email, phoneNo, gender, dob, designation, file };
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateStudentHealth({
    id,
    firstName,
    middleName,
    lastName,
    email,
    phoneNo,
    gender,
    dob,
    designation,
    file,
  }: {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    gender: string;
    dob: string;
    designation: string;
    file?: File;
  }) {
    const apiCall = this.apiService.apiCall(this.api.updateStudentHealth);
    const data: any = { id, firstName, middleName, lastName, email, phoneNo, gender, dob, designation };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteStudentHealth(id: number) {
    const apiCall = this.apiService.apiCall(this.api.deleteStudentHealth);
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
}
