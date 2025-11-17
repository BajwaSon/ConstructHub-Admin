/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader, WritableCoreSignal } from "@jot143/core-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Nurse } from "../model/Nurse";

@Injectable({
  providedIn: "root",
})
export class NurseService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  addDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  updateDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  api = {
    getAllNurses: "master.nurse.getAll",
    addNurse: "master.nurse.create",
    updateNurse: "master.nurse.update",
    deleteNurse: "master.nurse.delete",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  nurses = coreSignal<Nurse[]>([]);
  getAllNurses(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllNurses);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.nurses.setValue(await Nurse.createFromArray(apiCall.response.data));
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

  addNurse(
    {
      firstName,
      middleName,
      lastName,
      email,
      phoneNo,
      gender,
      dob,
      // designation,
      file,
    }: {
      firstName: string;
      middleName: string;
      lastName: string;
      email: string;
      phoneNo: string;
      gender: string;
      dob: string;
      // designation: string;
      file: File;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addNurse);
    apiCall.loader = loader;
    const data: any = { firstName, middleName, lastName, email, phoneNo, gender, dob };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateNurse(
    {
      id,
      firstName,
      middleName,
      lastName,
      email,
      phoneNo,
      gender,
      dob,
      // designation,
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
      // designation: string;
      file?: File;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateNurse);
    const data: any = { id, firstName, middleName, lastName, email, phoneNo, gender, dob };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteNurse(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteNurse);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
}
