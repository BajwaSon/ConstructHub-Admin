/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { BusAssistant } from "../model/BusAssistant";

@Injectable({
  providedIn: "root",
})
export class BusAssistantService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  addDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  updateDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  api = {
    getAllBusAssistants: "master.busAssistant.getAll",
    getAllBusAssistantsById: "master.busAssistant.getById",
    addBusAssistant: "master.busAssistant.create",
    updateBusAssistant: "master.busAssistant.update",
    deleteBusAssistant: "master.busAssistant.delete",
    bindStudentsWithAssistant: "master.busAssistant.bindChildWithBusAssistant",
    unbindStudentsFromAssistant: "master.busAssistant.unbindChildFromBusAssistant",
    getAllStudentsByAssistantId: "master.busAssistant.getAllStudentsByAssistantId",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  busAssistants = coreSignal<BusAssistant[]>([]);
  busAssistantById = coreSignal<BusAssistant | null>(null);
  getAllBusAssistants(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllBusAssistants);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.busAssistants.setValue(await BusAssistant.createFromArray(apiCall.response.data));
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
  getAllBusAssistantsById(id: any) {
    const apiCall = this.apiService.apiCall(this.api.getAllBusAssistantsById);
    apiCall.data = { id };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.busAssistantById.setValue(apiCall.response.data);
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

  bindStudentsWithAssistant({ childIds, busAssistantId }: { childIds: any; busAssistantId: string[] }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.bindStudentsWithAssistant);
    apiCall.data = { childIds, busAssistantId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  unbindStudentsFromAssistant({ childId, busAssistantId }: { childId: any; busAssistantId: string[] }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.unbindStudentsFromAssistant);
    apiCall.data = { childId, busAssistantId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  addBusAssistant(
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
    const apiCall = this.apiService.apiCall(this.api.addBusAssistant);
    apiCall.data = { firstName, middleName, lastName, email, phoneNo, gender, dob, file };
    apiCall.formData = true;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateBusAssistant(
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
    const apiCall = this.apiService.apiCall(this.api.updateBusAssistant);
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
  deleteBusAssistant(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteBusAssistant);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
