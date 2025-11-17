/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from "@angular/core";
import { ApiService, AlertService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { Holiday } from "../model/Holiday";

@Injectable({
  providedIn: "root",
})
export class HolidaySchedulingService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllHoliday: "scheduling.holiday.getHolidays",
    addHoliday: "master.holiday.create",
    createHoliday: "scheduling.holiday.createHoliday",
    updateHoliday: "master.holiday.update",
    deleteHoliday: "master.holiday.delete",
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
  holidays = coreSignal<Holiday[]>([]);

  getAllHolidays(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllHoliday);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.holidays.setValue(await Holiday.createFromArray(apiCall.response.data));
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

  createMeeting(
    {
      title,
      startDate,
      endDate,
      // repeatType,
      // repeatInterval,
      // repeatUnit,
      // repeatDays,
      // repeatEndDate,
      // metaData,
    }: {
      title: string;
      startDate: string;
      endDate: string;
      // repeatType: string;
      // repeatInterval: string;
      // repeatUnit: string;
      // repeatDays: [];
      // repeatEndDate: string;
      // metaData: [];
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.createHoliday);
    apiCall.data = { title, startDate, endDate };
    apiCall.loader = loader;

    // if (repeatType !== "Does not repeat") {
    //   apiCall.data.repeatType = repeatType;
    //   apiCall.data.repeatInterval = repeatInterval;
    //   apiCall.data.repeatUnit = repeatUnit;
    //   apiCall.data.repeatDays = repeatDays;
    //   apiCall.data.repeatEndDate = repeatEndDate;
    // }
    // apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  addHoliday(
    { name, description, gender, dob, designation, file }: { name: string; description: string; gender: string; dob: string; designation: string; file: File },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addHoliday);
    apiCall.data = { name, description, gender, dob, designation, file };
    apiCall.formData = true;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateHoliday(
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
    const apiCall = this.apiService.apiCall(this.api.updateHoliday);
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
  deleteHoliday(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteHoliday);
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
