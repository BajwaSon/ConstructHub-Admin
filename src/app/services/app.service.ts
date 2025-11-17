/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader, NavigationService } from "@jot143/core-angular";
import { ClassLevel } from "../model/ClassLevel";
import { ClassSubject } from "../model/classSubject";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);
  private router = inject(NavigationService);

  api = {
    classLevels: "school.classLevel.getAll",
    classSubjects: "config.subject.getAll",
    addLevels: "school.classLevel.add",
    levelBySubjects: "school.classLevel.getAllSubjects",
    updateLevels: "school.classLevel.update",
    addSubjects: "config.subject.create",
    updateSubjects: "config.subject.update",
    bindLevelBySubject: "config.subject.bindSubjectWithClassLevel",
    unbindLevelBySubject: "config.subject.unbindSubjectFromClassLevel",
    updatePassword: "user.updatePassword",
    deleteSubject: "config.subject.delete",
    deleteLevel: "school.classLevel.deleteClassLevel",
    createSession: "config.session.create",
  };

  genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];
  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  classLevels: WritableSignal<ClassLevel[]> = signal([]);
  classSubjects: WritableSignal<ClassSubject[]> = signal([]);
  levelBySubjects: WritableSignal<ClassLevel[]> = signal([]);

  sessions = coreSignal<any>([], {
    tableName: "pre-loaded",
    key: "session",
  });

  getSchoolSessions(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall("config.session.getAll");
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.sessions.setValue(apiCall.response.data, {
            tableName: "pre-loaded",
            key: "session",
          });
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

  getSchoolClassLevelsBySubjects(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.levelBySubjects);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.levelBySubjects.set(await ClassLevel.createFromArray(apiCall.response.data));
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

  createSession(
    { name, sessionStartDate, sessionEndDate, isActive }: { name: string; sessionStartDate: string; sessionEndDate: string; isActive?: boolean },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.api.createSession);
    const data: any = { name, sessionStartDate, sessionEndDate };
    if (isActive) {
      data.isActive = isActive;
    }
    apiCall.data = data;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  bindLevelBySubject({ subjectIds, classLevelId }: { subjectIds: any; classLevelId: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.bindLevelBySubject);
    apiCall.data = { subjectIds, classLevelId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  unbindLevelBySubject({ subjectId, classLevelId }: { subjectId: any; classLevelId: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.unbindLevelBySubject);
    apiCall.data = { subjectId, classLevelId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  getSchoolClassLevels(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.classLevels);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.classLevels.set(await ClassLevel.createFromArray(apiCall.response.data));
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

  getSchoolClassSubjects(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.classSubjects);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.classSubjects.set(await ClassSubject.createFromArray(apiCall.response.data));
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

  addSubject({ name }: { name: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.addSubjects);
    apiCall.data = { name };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateSubject({ id, name }: { id: string; name: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateSubjects);
    apiCall.data = { id, name } as any;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  addLevel({ levelName }: { levelName: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.addLevels);
    apiCall.data = { levelName };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateLevel({ id, levelName }: { id: string; levelName: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateLevels);
    apiCall.data = { id, levelName } as any;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updatePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updatePassword);
    apiCall.data = { currentPassword, newPassword };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteSubject(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteSubject);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteLevel(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteLevel);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
