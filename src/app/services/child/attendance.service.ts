/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal } from "@jot143/core-angular";

import { combineLatest } from "rxjs";
import { ConfigureChildrenService } from "./configure-children.service";

import { Child } from "../../model/Child";

@Injectable({
  providedIn: "root",
})
export class AttendanceService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  private configureChildrenService = inject(ConfigureChildrenService);

  awesome = coreSignal<{ createdAt: string; value: number }[]>([], {
    tableName: "pre-loaded",
    key: `awesome-${this.configureChildrenService.selectedChildId()}-attendance}`,
  });
  good = coreSignal<{ createdAt: string; value: number }[]>([], {
    tableName: "pre-loaded",
    key: `good-${this.configureChildrenService.selectedChildId()}-attendance}`,
  });
  notBad = coreSignal<{ createdAt: string; value: number }[]>([], {
    tableName: "pre-loaded",
    key: `notBad-${this.configureChildrenService.selectedChildId()}-attendance}`,
  });

  constructor() {
    combineLatest([this.configureChildrenService.selectedChildId.subject]).subscribe(() => {
      this.awesome.updateIndexDb({
        tableName: "pre-loaded",
        key: `awesome-${this.configureChildrenService.selectedChildId()}-attendance}`,
      });
      this.good.updateIndexDb({
        tableName: "pre-loaded",
        key: `good-${this.configureChildrenService.selectedChildId()}-attendance}`,
      });
      this.notBad.updateIndexDb({
        tableName: "pre-loaded",
        key: `notBad-${this.configureChildrenService.selectedChildId()}-attendance}`,
      });
    });
  }
  getAttendanceDetail(child: Child) {
    const apiCall = this.apiService.apiCall("parent.child.attendance.get");
    apiCall.params = { childId: child.id, classLevelId: child.classLevelId };
    // apiCall.params = { childId: child.id, classLevelId: classLevelId: Number(child.classLevelId) };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          const data = apiCall?.response?.data ?? [];
          const behaviorData: {
            awesome: { createdAt: string; value: number }[];
            good: { createdAt: string; value: number }[];
            notBad: { createdAt: string; value: number }[];
          } = {
            awesome: [],
            good: [],
            notBad: [],
          };

          for (const d of data) {
            if (d.behavior == 100) {
              behaviorData.awesome.push({ createdAt: d.createdAt, value: d.behavior });
            } else if (d.behavior == 50) {
              behaviorData.good.push({ createdAt: d.createdAt, value: d.behavior });
            } else if (d.behavior == 0) {
              behaviorData.notBad.push({ createdAt: d.createdAt, value: d.behavior });
            }
          }
          this.awesome.setValue(behaviorData.awesome, {
            tableName: "pre-loaded",
            key: `awesome-child-${child.id}-attendance}`,
          });
          this.good.setValue(behaviorData.good, {
            tableName: "pre-loaded",
            key: `good-child-${child.id}-attendance}`,
          });
          this.notBad.setValue(behaviorData.notBad, {
            tableName: "pre-loaded",
            key: `notBad-child-${child.id}-attendance}`,
          });
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async err => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });

    apiCall.exe().subscribe();
  }
  getAttendanceMonthly(child: Child, classLevelId?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.attendance.getAttendanceMonthly");
    apiCall.params = { childId: child.id, classLevelId: classLevelId };
    // apiCall.params = { childId: child.id, classLevelId: classLevelId, subjectId: subjectId };

    return new Promise((resolve, reject) => {
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall.response?.status === "OK") {
            const data = apiCall.response?.data ?? [];
            resolve(data);
          } else {
            reject(apiCall.response.message || "Something went wrong");
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: err => {
          reject(err.message || "Something went wrong");
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
  getChildAttendanceDaily(child: Child, month?: string | number, classLevelId?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.attendance.getAttendanceDaily");
    apiCall.params = { childId: child.id, classLevelId: classLevelId, month: month ?? new Date().getMonth() + 1 };

    return new Promise((resolve, reject) => {
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall.response?.status === "OK") {
            const data = apiCall.response?.data ?? [];
            resolve(data);
          } else {
            reject(apiCall.response.message || "Something went wrong");
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: err => {
          reject(err.message || "Something went wrong");
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
  getOverallAttendanceMonthly(classLevelId?: string | number) {
    const apiCall = this.apiService.apiCall("school.attendance.getAllSchoolStudentsAttendanceMonthly");
    apiCall.params = { classLevelId: classLevelId };

    return new Promise((resolve, reject) => {
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall.response?.status === "OK") {
            const data = apiCall.response?.data ?? [];
            resolve(data);
          } else {
            reject(apiCall.response.message || "Something went wrong");
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: err => {
          reject(err.message || "Something went wrong");
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
  getOverallAttendanceDaily(classLevelId?: string | number, month?: number | string) {
    const apiCall = this.apiService.apiCall("school.attendance.getAllSchoolStudentsAttendanceDaily");
    apiCall.params = { classLevelId: classLevelId, month: month ?? new Date().getMonth() + 1 };

    return new Promise((resolve, reject) => {
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall.response?.status === "OK") {
            const data = apiCall.response?.data ?? [];
            resolve(data);
          } else {
            reject(apiCall.response.message || "Something went wrong");
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: err => {
          reject(err.message || "Something went wrong");
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
}
