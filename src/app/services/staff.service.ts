/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { Staff } from "../model/Staff";

@Injectable({
  providedIn: "root",
})
export class StaffService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllStaff: "master.staff.getAll",
    addStaff: "master.staff.create",
    updateStaff: "master.staff.update",
    deleteStaff: "master.staff.delete",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  departmentOptions = [
    { value: "", label: "Select Department" },
    { value: "administration", label: "Administration" },
    { value: "academic", label: "Academic" },
    { value: "maintenance", label: "Maintenance" },
    { value: "security", label: "Security" },
    { value: "transportation", label: "Transportation" },
    { value: "cafeteria", label: "Cafeteria" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  staffList = coreSignal<Staff[]>([]);

  getAllStaff(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllStaff);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.staffList.setValue(apiCall.response.data);
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

  addStaff(
    {
      firstName,
      middleName,
      lastName,
      email,
      phoneNo,
      gender,
      dob,
      designation,
      // departmentIds,
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
      // departmentIds: any[];
      file?: File;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addStaff);
    apiCall.loader = loader;
    const data: any = { firstName, middleName, lastName, email, phoneNo, gender, dob, designation };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateStaff(
    {
      id,
      firstName,
      middleName,
      lastName,
      email,
      phoneNo,
      gender,
      dob,
      designation,
      // departmentIds,
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
      // departmentIds: string[];
      file?: File;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateStaff);
    apiCall.loader = loader;
    const data: any = { id, firstName, middleName, lastName, email, phoneNo, gender, dob, designation };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteStaff(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteStaff);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
}
