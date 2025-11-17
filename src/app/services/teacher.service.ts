/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader, WritableCoreSignal } from "@jot143/core-angular";
import { Department } from "../model/department";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Staff } from "../model/Staff";
import { Teacher } from "../model/Teacher";
import { Subject } from "../model/Subject";
import { BusAssistant } from "../model/BusAssistant";
import { Nurse } from "../model/Nurse";
import { Admin } from "../model/Admin";

@Injectable({
  providedIn: "root",
})
export class TeacherService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllTeachers: "master.teacher.getAll",
    getAllStaffWithRoles: "master.staff.getAllStaffWithRoles",
    getTeachersByClassSection: "master.teacher.getAllTeachersHierarchy",
    getAllSubjects: "config.subject.getAll",
    addTeacher: "master.teacher.create",
    updateTeacher: "master.teacher.update",
    deleteTeacher: "master.teacher.delete",
    unassignTeacher: "master.teacher.unmapDepartment",
    getStaff: "school.staff.staff",
    bindTeacherBySection: "master.teacher.mapClassSectionSubject",
    unbindTeacherBySection: "master.teacher.unmapClassSectionSubject",
    bindSubjectBySection: "master.teacher.mapClassSectionSubject",
    unbindSubjectBySection: "master.teacher.unmapClassSectionSubject",
    deleteOccurrence: "meeting.deleteOccurrence",
    deleteSeries: "meeting.deleteSeries",
  };

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  teachers = coreSignal<Teacher[]>([]);
  teachersByClassSection = coreSignal<Teacher[]>([]);
  staffWithRoles = coreSignal<any[]>([]);
  subjects = coreSignal<Subject[]>([]);
  staff = coreSignal<Staff[]>([]);
  adminRoles = coreSignal<any[]>([]);
  teacherRoles = coreSignal<any[]>([]);
  nurseRoles = coreSignal<any[]>([]);
  busAssistantRoles = coreSignal<any[]>([]);
  staffRoles = coreSignal<any[]>([]);

  getAllSubjects() {
    const apiCall = this.apiService.apiCall(this.api.getAllSubjects);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.subjects.setValue(await Subject.createFromArray(apiCall.response.data));
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
  getAllTeachers(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllTeachers);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.teachers.setValue(await Teacher.createFromArray(apiCall.response.data));
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
  getAllStaffWithRoles(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllStaffWithRoles);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          const data = apiCall.response.data;
          this.teacherRoles.setValue((await Teacher.createFromArray(data.Teacher)) || []);
          this.nurseRoles.setValue((await Nurse.createFromArray(data.Nurse)) || []);
          this.busAssistantRoles.setValue((await BusAssistant.createFromArray(data.BusAssistant)) || []);
          this.staffRoles.setValue((await Staff.createFromArray(data.Staff)) || []);
          this.adminRoles.setValue((await Admin.createFromArray(data.Admin)) || []);

          // this.staffWithRoles.setValue([...this.teacherRoles(), ...this.nurseRoles(), ...this.busAssistantRoles(), ...this.staffRoles()]);
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
  getAllTeachersByClassSection(loader = new RequestLoader()) {
    // const apiCall = this.apiService.apiCall(this.api.getAllTeachers);
    const apiCall = this.apiService.apiCall(this.api.getTeachersByClassSection);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.teachersByClassSection.setValue(await Teacher.createFromArray(apiCall.response.data));
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
  bindTeacherBySection({ class_section_id, teacher_id, subject_id }: { class_section_id: any; teacher_id: string; subject_id: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.bindTeacherBySection);
    apiCall.loader = loader;
    apiCall.data = { class_section_id, teacher_id, subject_id };
    apiCall.exe().subscribe();
    return apiCall;
  }
  unbindTeacherBySection({ class_section_id, teacher_id, subject_id }: { class_section_id: any; teacher_id: string; subject_id: any }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.unbindTeacherBySection);
    apiCall.loader = loader;
    apiCall.data = { class_section_id, teacher_id, subject_id };
    apiCall.exe().subscribe();
    return apiCall;
  }
  bindSubjectBySection({ class_section_id, subject_id, teacher_id }: { class_section_id: any; subject_id: string; teacher_id: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.bindSubjectBySection);
    apiCall.loader = loader;
    apiCall.data = { class_section_id, subject_id, teacher_id };
    apiCall.exe().subscribe();
    return apiCall;
  }

  unbindSubjectBySection({ class_section_id, subject_id, teacher_id }: { class_section_id: any; subject_id: string; teacher_id: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.unbindSubjectBySection);
    apiCall.loader = loader;
    apiCall.data = { class_section_id, subject_id, teacher_id };
    apiCall.exe().subscribe();
    return apiCall;
  }
  addTeacher(
    {
      firstName,
      middleName,
      lastName,
      email,
      phoneNo,
      gender,
      subjectIds,
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
      subjectIds: string[];
      dob: string;
      // designation: string;
      file: File;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.addTeacher);
    apiCall.loader = loader;
    apiCall.data = { firstName, middleName, lastName, email, phoneNo, gender, subjectIds, dob, file };
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateTeacher(
    {
      id,
      firstName,
      middleName,
      lastName,
      email,
      phoneNo,
      gender,
      subjectIds,
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
      subjectIds: string[];
      dob: string;
      // designation: string;
      file?: File;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.updateTeacher);
    apiCall.loader = loader;
    const data: any = { id, firstName, middleName, lastName, email, phoneNo, gender, subjectIds, dob };
    if (file) {
      data.file = file;
    }
    apiCall.data = data;
    apiCall.formData = true;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteTeacher(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteTeacher);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteOccurrence({ id, start, end }: { id: string; start: string; end: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteOccurrence);
    apiCall.loader = loader;
    apiCall.data = { id, start, end };
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteSeries({ id }: { id: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteSeries);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
}
