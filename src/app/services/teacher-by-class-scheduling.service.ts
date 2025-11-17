import { Injectable, inject } from "@angular/core";
import { ApiService, AlertService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { TeacherByClass } from "../model/TeacherByClass";

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable({
  providedIn: "root",
})
export class TeacherByClassSchedulingService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllTeacherByClass: "master.teacherByClass.getAll",
    addTeacherByClass: "master.teacherByClass.create",
    createMeeting: "scheduling.meeting.create",
    updateTeacherByClass: "master.teacherByClass.update",
    deleteTeacherByClass: "master.teacherByClass.delete",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  teacherByClasses = coreSignal<TeacherByClass[]>([]);
  getAllTeacherByClasses() {
    const apiCall = this.apiService.apiCall(this.api.getAllTeacherByClass);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.teacherByClasses.setValue(await TeacherByClass.createFromArray(apiCall.response.data));
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

  addTeacherByClass(
    { name, description, gender, dob, designation, file }: { name: string; description: string; gender: string; dob: string; designation: string; file: File },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addTeacherByClass);
    apiCall.data = { name, description, gender, dob, designation, file };
    apiCall.formData = true;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  createMeeting(
    {
      namespace,
      title,
      startDateTime,
      endDateTime,
      repeatType,
      participants,
      classRoomId,
      classSectionId,
      repeatInterval,
      repeatUnit,
      repeatDays,
      repeatEndDate,
      metaData,
    }: {
      namespace: string;
      title: string;
      startDateTime: string;
      endDateTime: string;
      repeatType: string;
      participants: [];
      classRoomId: string;
      classSectionId: string;
      repeatInterval: string;
      repeatUnit: string;
      repeatDays: [];
      repeatEndDate: string;
      metaData: [];
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.createMeeting);
    apiCall.data = { namespace, title, startDateTime, endDateTime, participants, classRoomId, classSectionId, metaData };
    apiCall.loader = loader;
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

  updateTeacherByClass(
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
    const apiCall = this.apiService.apiCall(this.api.updateTeacherByClass);
    const data: any = { id, name, description, gender, dob, designation };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteTeacherByClass(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteTeacherByClass);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
