/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from "@angular/core";
import { ApiService, AlertService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { Workdays } from "../model/WorkDays";

@Injectable({
  providedIn: "root",
})
export class WorkdaysSchedulingService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllWorkdays: "scheduling.workDay.getWorkDays",
    addWorkdays: "master.workdays.create",
    createWorkdayMeeting: "scheduling.workDay.createWorkDay",
    updateWorkdays: "master.workdays.update",
    deleteWorkdays: "master.workdays.delete",
    deleteOccurrence: "meeting.deleteOccurrence",
    deleteSeries: "meeting.deleteSeries",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  workdays = coreSignal<Workdays[]>([]);
  getAllWorkdays(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllWorkdays);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.workdays.setValue(await Workdays.createFromArray(apiCall.response.data));
          return;
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async (err: Error) => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });

    apiCall.exe().subscribe();

    return apiCall;
  }
  createMeeting(
    {
      title,
      startDateTime,
      endDateTime,
      repeatType,
      participants,
      classRoomId,
      repeatInterval,
      repeatUnit,
      repeatDays,
      repeatEndDate,
      metaData,
    }: {
      title: string;
      startDateTime: string;
      endDateTime: string;
      repeatType: string;
      participants: [];
      classRoomId: string;
      repeatInterval: string;
      repeatUnit: string;
      repeatDays: [];
      repeatEndDate: string;
      metaData: [];
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.createWorkdayMeeting);
    apiCall.loader = loader;
    apiCall.data = { title, startDateTime, endDateTime, participants, classRoomId, metaData };

    if (repeatType !== "Does not repeat") {
      apiCall.data.repeatType = repeatType;
      apiCall.data.repeatInterval = repeatInterval;
      apiCall.data.repeatUnit = repeatUnit;
      apiCall.data.repeatDays = repeatDays;
      apiCall.data.repeatEndDate = repeatEndDate;
    }
    // apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }
  addWorkdays(
    { name, description, gender, dob, designation, file }: { name: string; description: string; gender: string; dob: string; designation: string; file: File },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addWorkdays);
    apiCall.data = { name, description, gender, dob, designation, file };
    apiCall.formData = true;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateWorkdays(
    {
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
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateWorkdays);
    apiCall.loader = loader;
    const data: any = { id, name, description, gender, dob, designation };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteWorkdays(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteWorkdays);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteOccurrence({ id, start, end }: { id: string; start: string; end: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteOccurrence);
    apiCall.data = { id, start, end };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteSeries({ id }: { id: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteSeries);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
