/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader, WritableCoreSignal } from "@jot143/core-angular";
import { Department } from "../model/department";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Staff } from "../model/Staff";

@Injectable({
  providedIn: "root",
})
export class DepartmentService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  addDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  updateDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  api = {
    getDepartments: "school.department.getAll",
    addDepartment: "school.department.create",
    updateDepartment: "school.department.update",
    unassignTeacher: "school.department.unmapStaff",
    assignTeacher: "school.department.mapStaff",
    getStaff: "school.staff.staff",
    makeHod: "school.department.makeHod",
    deleteDepartment: "school.department.delete",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;

  departments = coreSignal<Department[]>([]);
  staff = coreSignal<Staff[]>([]);
  getDepartments(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getDepartments);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.departments.setValue(await Department.createFromArray(apiCall.response.data));
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
  getStaff() {
    const apiCall = this.apiService.apiCall(this.api.getStaff);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.staff.setValue(await Staff.createFromArray(apiCall.response.data));
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

  addDepartment(name: string, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.addDepartment);
    apiCall.data = name;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  updateDepartment(name: string, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateDepartment);
    apiCall.data = name;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  unassignTeacher(id: string, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.unassignTeacher);
    apiCall.data = id;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  assignTeacher(id: string, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.assignTeacher);
    apiCall.data = id;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  makeHod(id: string, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.makeHod);
    apiCall.data = id;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteDepartment(payload: any, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteDepartment);
    apiCall.data = payload;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
