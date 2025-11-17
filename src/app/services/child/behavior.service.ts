/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable, inject } from "@angular/core";
import { AlertService, ApiService, coreSignal } from "@jot143/core-angular";
import { combineLatest } from "rxjs";
import { monthOptions } from "../../common/options/months";
import { Child } from "../../model/Child";
import { ConfigureSectionService } from "./configure-section.service";

@Injectable({
  providedIn: "root",
})
export class BehaviorService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  private configureSectionService = inject(ConfigureSectionService);
  getCurrentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  selectedMonth = coreSignal(monthOptions.find(option => option.value === this.getCurrentMonth) || monthOptions[0]);
  awesome = coreSignal<{ createdAt: string; value: number }[]>([], {
    tableName: "pre-loaded",
    key: `awesome-child-${this.configureSectionService.selectedChildId()}-month-${this.selectedMonth().value}`,
  });
  good = coreSignal<{ createdAt: string; value: number }[]>([], {
    tableName: "pre-loaded",
    key: `good-child-${this.configureSectionService.selectedChildId()}-month-${this.selectedMonth().value}`,
  });
  notBad = coreSignal<{ createdAt: string; value: number }[]>([], {
    tableName: "pre-loaded",
    key: `notBad-child-${this.configureSectionService.selectedChildId()}-month-${this.selectedMonth().value}`,
  });

  constructor() {
    this.configureSectionService.selectedChildId.subject.subscribe(() => {
      this.selectedMonth.updateIndexDb({
        tableName: "pre-loaded",
        key: `month-${this.configureSectionService.selectedChildId()}`,
      });
    });

    combineLatest([this.selectedMonth.subject, this.configureSectionService.selectedChildId.subject]).subscribe(() => {
      this.awesome.updateIndexDb({
        tableName: "pre-loaded",
        key: `awesome-child-${this.configureSectionService.selectedChildId()}-month-${this.selectedMonth().value}`,
      });
      this.good.updateIndexDb({
        tableName: "pre-loaded",
        key: `good-child-${this.configureSectionService.selectedChildId()}-month-${this.selectedMonth().value}`,
      });
      this.notBad.updateIndexDb({
        tableName: "pre-loaded",
        key: `notBad-child-${this.configureSectionService.selectedChildId()}-month-${this.selectedMonth().value}`,
      });
    });
  }

  getBehaviorDetail(child: Child) {
    const apiCall = this.apiService.apiCall("parent.child.behavior.get");
    apiCall.params = { childId: child.id, classLevelId: Number(child.classLevelId), subjectId: 1 };
    // apiCall.params = { childId: child.id, classLevelId: Number(child.classLevelId), subjectId: 1 };

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
            key: `awesome-child-${child.id}-month-${this.selectedMonth().value}`,
          });
          this.good.setValue(behaviorData.good, {
            tableName: "pre-loaded",
            key: `good-child-${child.id}-month-${this.selectedMonth().value}`,
          });
          this.notBad.setValue(behaviorData.notBad, {
            tableName: "pre-loaded",
            key: `notBad-child-${child.id}-month-${this.selectedMonth().value}`,
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
  getBehaviorMonthlyDetail(child: Child, classLevelId?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.behavior.getBehaviorMonthly");
    apiCall.params = { childId: child.id, classLevelId: classLevelId };

    return new Promise((resolve, reject) => {
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall.response?.status === "OK") {
            const data = apiCall.response?.data ?? [];
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
              key: `awesome-child-${child.id}-month-${this.selectedMonth().value}`,
            });
            this.good.setValue(behaviorData.good, {
              tableName: "pre-loaded",
              key: `good-child-${child.id}-month-${this.selectedMonth().value}`,
            });
            this.notBad.setValue(behaviorData.notBad, {
              tableName: "pre-loaded",
              key: `notBad-child-${child.id}-month-${this.selectedMonth().value}`,
            });
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
  getBehaviorDailyDetail(child: Child, month?: string | number, classLevelId?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.behavior.getBehaviorDaily");
    apiCall.params = { childId: child.id, classLevelId: classLevelId, month: month ?? new Date().getMonth() + 1 };

    return new Promise((resolve, reject) => {
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall.response?.status === "OK") {
            const data = apiCall.response?.data ?? [];
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
              key: `awesome-child-${child.id}-month-${this.selectedMonth().value}`,
            });
            this.good.setValue(behaviorData.good, {
              tableName: "pre-loaded",
              key: `good-child-${child.id}-month-${this.selectedMonth().value}`,
            });
            this.notBad.setValue(behaviorData.notBad, {
              tableName: "pre-loaded",
              key: `notBad-child-${child.id}-month-${this.selectedMonth().value}`,
            });
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
  getOverallBehaviorMonthlyDetail(classLevelId?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.behavior.getAllSchoolStudentsBehaviorMonthly");
    apiCall.params = { classLevelId: classLevelId };

    return new Promise((resolve, reject) => {
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall.response?.status === "OK") {
            const data = apiCall.response?.data ?? [];
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
              key: `awesome-child-month-${this.selectedMonth().value}`,
            });
            this.good.setValue(behaviorData.good, {
              tableName: "pre-loaded",
              key: `good-child-month-${this.selectedMonth().value}`,
            });
            this.notBad.setValue(behaviorData.notBad, {
              tableName: "pre-loaded",
              key: `notBad-child-month-${this.selectedMonth().value}`,
            });
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
  getOverallBehaviorDailyDetail(month?: string | number, classLevelId?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.behavior.getAllSchoolStudentsBehaviorDaily");
    apiCall.params = { classLevelId: classLevelId, month: month ?? new Date().getMonth() + 1 };

    return new Promise((resolve, reject) => {
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall.response?.status === "OK") {
            const data = apiCall.response?.data ?? [];
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
              key: `awesome-child-month-${this.selectedMonth().value}`,
            });
            this.good.setValue(behaviorData.good, {
              tableName: "pre-loaded",
              key: `good-child-month-${this.selectedMonth().value}`,
            });
            this.notBad.setValue(behaviorData.notBad, {
              tableName: "pre-loaded",
              key: `notBad-child-month-${this.selectedMonth().value}`,
            });
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
