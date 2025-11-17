/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
// import { subjectOptions } from "../../common/options/subjects";
import { combineLatest } from "rxjs";
import { monthOptions } from "../../common/options/months";
import { Child } from "../../model/Child";
import { PerformanceOption } from "../../model/PerformanceOption";
import { AvatarService } from "../avatar.service";
import { ConfigureSectionService } from "./configure-section.service";
@Injectable({
  providedIn: "root",
})
export class PerformanceService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  private configureSectionService = inject(ConfigureSectionService);
  private avatarService = inject(AvatarService);

  colorCache: { [key: string]: { line: string; area: string } } = {};

  subjectOptions = coreSignal<PerformanceOption[]>([]);
  subjectPerformanceOptions = coreSignal<PerformanceOption[]>([]);
  selectedSubjectPerformanceOptions = coreSignal<PerformanceOption[]>([]);
  selectedSubject = coreSignal<{ label: string; value: string }>(
    { label: "Select Subject", value: "" },
    {
      tableName: "pre-loaded",
      key: `subject-${this.configureSectionService.selectedChildId()}`,
    }
  );
  getCurrentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  selectedMonth = coreSignal(monthOptions.find(option => option.value === this.getCurrentMonth) || monthOptions[0]);

  // Dynamic performance data storage
  performanceData = coreSignal<Record<string, { createdAt: string; value: number }[]>>(
    {},
    {
      tableName: "pre-loaded",
      key: `performance-${this.configureSectionService.selectedChildId()}-subject-${this.selectedSubject().value}`,
    }
  );

  constructor() {
    combineLatest([this.selectedSubject.subject, this.configureSectionService.selectedChildId.subject]).subscribe(() => {
      this.performanceData.updateIndexDb({
        tableName: "pre-loaded",
        key: `performance-${this.configureSectionService.selectedChildId()}-subject-${this.selectedSubject().value}`,
      });
      this.selectedSubject.updateIndexDb({
        tableName: "pre-loaded",
        key: `subject-${this.configureSectionService.selectedChildId()}`,
      });
    });
  }
  getSelectedSubjectPerformanceAverages(): { name: string; value: number }[] {
    const options = this.selectedSubjectPerformanceOptions();
    if (!options || options.length === 0) return [];
    return options.map((option: any) => ({
      name: option.name,
      value: this.calculateAverage(option.id),
    }));
  }
  // Calculate average for a specific performance option
  calculateAverage(optionId: number): number {
    const data = this.performanceData()[optionId] || [];
    if (data.length > 0) {
      return Number((data.reduce((total, item) => total + item.value, 0) / data.length).toFixed(1));
    }
    return 0;
  }

  getPerformanceColor(key: string): { line: string; area: string } {
    if (this.colorCache[key]) return this.colorCache[key];
    const line = this.avatarService.getAvatarColor(key);
    // Area color: same as line but with opacity (using rgba)
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r},${g},${b}`;
    };
    const area = `rgba(${hexToRgb(line)},0.15)`;
    this.colorCache[key] = { line, area };
    return this.colorCache[key];
  }
  getPerformanceDetail(child: Child, subjectId?: number | string) {
    const apiCall = this.apiService.apiCall("parent.child.performance.get");
    apiCall.params = { childId: child.id, classLevelId: Number(child.classLevelId), subjectId: subjectId ? subjectId : this.selectedSubject().value };
    return new Promise(resolve => {
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status === "OK") {
            const data = apiCall?.response?.data ?? [];
            const performanceData: Record<number, { createdAt: string; value: number }[]> = {};

            // Get selected subject's performance options
            const selectedSubject = this.subjectOptions().find(subject => subject.id == (subjectId ?? this.selectedSubject().value));

            if (selectedSubject) {
              // Initialize performance data for each option
              selectedSubject.performanceOptions.forEach((option: any) => {
                performanceData[option.id] = [];
              });

              // Fill in the data
              for (const d of data) {
                if (performanceData[d.performanceOptionId]) {
                  performanceData[d.performanceOptionId].push({
                    createdAt: d.createdAt,
                    value: Number(d.rating),
                  });
                }
              }
            }

            this.performanceData.setValue(performanceData);
            resolve(data);
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async err => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }

  getPerformanceMonthlyDetail(child: Child, subjectId?: string | number, classLevelId?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.performance.getPerformanceMonthly");
    apiCall.params = { childId: child.id, classLevelId: classLevelId, subjectId: subjectId };
    return new Promise(resolve => {
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status == "OK") {
            const data = apiCall?.response?.data ?? [];
            const performanceData: Record<number, { createdAt: string; value: number }[]> = {};

            // Get selected subject's performance options
            const selectedSubject = this.subjectOptions().find(subject => subject.id == (subjectId ?? this.selectedSubject().value));

            if (selectedSubject) {
              // Initialize performance data for each option
              selectedSubject.performanceOptions.forEach((option: any) => {
                performanceData[option.id] = [];
              });

              // Fill in the data
              for (const d of data) {
                if (performanceData[d.performanceOptionId]) {
                  performanceData[d.performanceOptionId].push({
                    createdAt: d.createdAt,
                    value: Number(d.rating),
                  });
                }
              }
            }

            this.performanceData.setValue(performanceData);
            resolve(data);
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async err => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
  getPerformanceDailyDetail(child: Child, month?: string | number, subjectId?: string | number, classLevelId?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.performance.getPerformanceDaily");
    apiCall.params = { childId: child.id, classLevelId: classLevelId, subjectId: subjectId, month: month ?? new Date().getMonth() + 1 };
    return new Promise(resolve => {
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status == "OK") {
            const data = apiCall?.response?.data ?? [];
            const performanceData: Record<number, { createdAt: string; value: number }[]> = {};

            // Get selected subject's performance options
            const selectedSubject = this.subjectOptions().find(subject => subject.id == (subjectId ?? this.selectedSubject().value));

            if (selectedSubject) {
              // Initialize performance data for each option
              selectedSubject.performanceOptions.forEach((option: any) => {
                performanceData[option.id] = [];
              });

              // Fill in the data
              for (const d of data) {
                if (performanceData[d.performanceOptionId]) {
                  performanceData[d.performanceOptionId].push({
                    createdAt: d.createdAt,
                    value: Number(d.rating),
                  });
                }
              }
            }

            this.performanceData.setValue(performanceData);
            resolve(data);
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async err => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
  getOverallPerformanceMonthlyDetail(classLevelId?: string | number, subjectId?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.performance.getAllSchoolStudentsPerformanceMonthly");
    apiCall.params = { subjectId: subjectId, classLevelId: classLevelId };
    return new Promise(resolve => {
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status == "OK") {
            const data = apiCall?.response?.data ?? [];
            const performanceData: Record<number, { createdAt: string; value: number }[]> = {};

            // Get selected subject's performance options
            const selectedSubject = this.subjectOptions().find(subject => subject.id == (subjectId ?? this.selectedSubject().value));

            if (selectedSubject) {
              // Initialize performance data for each option
              selectedSubject.performanceOptions.forEach((option: any) => {
                performanceData[option.id] = [];
              });

              // Fill in the data
              for (const d of data) {
                if (performanceData[d.performanceOptionId]) {
                  performanceData[d.performanceOptionId].push({
                    createdAt: d.createdAt,
                    value: Number(d.rating),
                  });
                }
              }
            }

            this.performanceData.setValue(performanceData);

            resolve(data);
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async err => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }

  getOverallPerformanceDailyDetail(classLevelId?: string | number, subjectId?: string | number, month?: string | number): Promise<any> {
    const apiCall = this.apiService.apiCall("parent.child.performance.getAllSchoolStudentsPerformanceDaily");
    apiCall.params = { subjectId: subjectId, classLevelId: classLevelId, month: month ?? new Date().getMonth() + 1 };
    return new Promise(resolve => {
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status == "OK") {
            const data = apiCall?.response?.data ?? [];

            const performanceData: Record<number, { createdAt: string; value: number }[]> = {};

            // Get selected subject's performance options
            const selectedSubject = this.subjectOptions().find(subject => subject.id == (subjectId ?? this.selectedSubject().value));

            if (selectedSubject) {
              // Initialize performance data for each option
              selectedSubject.performanceOptions.forEach((option: any) => {
                performanceData[option.id] = [];
              });

              // Fill in the data
              for (const d of data) {
                if (performanceData[d.performanceOptionId]) {
                  performanceData[d.performanceOptionId].push({
                    createdAt: d.createdAt,
                    value: Number(d.rating),
                  });
                }
              }
            }

            this.performanceData.setValue(performanceData);

            resolve(data);
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async err => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }

  getAllPerformanceOptions(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall("config.performanceOption.getAll");
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: () => {
        if (apiCall.response?.status === "OK") {
          const data = apiCall.response.data;
          const defaultOption = { id: "", name: "Select Subject", performanceOptions: [] };
          const defaultSelectedSubject = { label: "Select Subject", value: "" };

          const allOptions = [defaultOption, ...data];
          this.subjectOptions.setValue(allOptions);
          this.subjectPerformanceOptions.setValue(data);
          // Set initial selected subject if not already set
          if (!this.selectedSubject().value) {
            this.selectedSubject.setValue(defaultSelectedSubject);
          }
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: (err: Error) => {
        this.alertService.error(err.message);
      },
    });
    apiCall.exe().subscribe();
    return apiCall;
  }
  getAllPerformanceOptionsBySubject(subjectId: string, loader = new RequestLoader()) {
    if (!subjectId) return;
    const apiCall = this.apiService.apiCall("config.performanceOption.getPerformanceOptionsBySubjectId");
    apiCall.loader = loader;
    apiCall.data = { subjectId: subjectId };
    // apiCall.params = { subjectId: subjectId };
    apiCall.subject.subscribe({
      next: () => {
        if (apiCall.response?.status === "OK") {
          this.selectedSubjectPerformanceOptions.setValue(apiCall.response.data);
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: (err: Error) => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });
    apiCall.exe().subscribe();
    return apiCall;
  }
  addPerformanceOption({ subject_id, name }: { subject_id: number; name: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall("config.performanceOption.create");
    apiCall.data = { name, subject_id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updatePerformanceOption({ subject_id, id }: { subject_id: number; id: number }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall("config.performanceOption.update");
    apiCall.data = { subject_id, id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deletePerformanceOption({ id }: { id: number }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall("config.performanceOption.delete");
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
