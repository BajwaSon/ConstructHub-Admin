/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertService, ApiService, coreSignal } from "@jot143/core-angular";
import { Meeting } from "../model/Meeting";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MeetingService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllMeetings: "scheduling.teacher.getMeetings",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  meetings = coreSignal<Meeting[]>([]);

  getAllMeetings(teacherId: any) {
    const apiCall = this.apiService.apiCall(this.api.getAllMeetings);
    apiCall.data = { teacherId: teacherId };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.meetings.setValue(await Meeting.createFromArray(apiCall.response.data));
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
}
