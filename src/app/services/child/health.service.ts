/* eslint-disable @typescript-eslint/no-unused-vars */

import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";

import { ConfigureChildrenService } from "./configure-children.service";
import { Child } from "../../model/Child";
import { Health } from "../../model/Health";

@Injectable({
  providedIn: "root",
})
export class HealthService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);
  private configureChildrenService = inject(ConfigureChildrenService);
  api = {
    getHealthSymptoms: "config.healthSymptom.getAll",
    addHealthSymptoms: "config.healthSymptom.create",
    updateHealthSymptoms: "config.healthSymptom.update",
    deleteHealthSymptoms: "config.healthSymptom.delete",
  };
  actionSheetOpen = false;
  healthSymptoms = coreSignal<Health[]>([]);
  heartRate = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `heartRate-child-${this.configureChildrenService.selectedChildId()}`,
  });

  bodyTemperature = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `bodyTemperature-child-${this.configureChildrenService.selectedChildId()}`,
  });

  bloodPressure = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `bloodPressure-child-${this.configureChildrenService.selectedChildId()}`,
  });

  hrv = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `hrv-child-${this.configureChildrenService.selectedChildId()}`,
  });

  spo2 = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `spo2-child-${this.configureChildrenService.selectedChildId()}`,
  });

  stressValue = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `stressValue-child-${this.configureChildrenService.selectedChildId()}`,
  });

  breathingRate = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `breathingRate-child-${this.configureChildrenService.selectedChildId()}`,
  });

  calories = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `calories-child-${this.configureChildrenService.selectedChildId()}`,
  });

  sleepHours = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `sleepHours-child-${this.configureChildrenService.selectedChildId()}`,
  });

  constructor() {
    this.configureChildrenService.selectedChildId.subject.subscribe(() => {
      this.heartRate.updateIndexDb({
        tableName: "pre-loaded",
        key: `heartRate-child-${this.configureChildrenService.selectedChildId()}`,
      });
      this.bodyTemperature.updateIndexDb({
        tableName: "pre-loaded",
        key: `bodyTemperature-child-${this.configureChildrenService.selectedChildId()}`,
      });
      this.bloodPressure.updateIndexDb({
        tableName: "pre-loaded",
        key: `bloodPressure-child-${this.configureChildrenService.selectedChildId()}`,
      });
      this.hrv.updateIndexDb({
        tableName: "pre-loaded",
        key: `hrv-child-${this.configureChildrenService.selectedChildId()}`,
      });
      this.spo2.updateIndexDb({
        tableName: "pre-loaded",
        key: `spo2-child-${this.configureChildrenService.selectedChildId()}`,
      });
      this.stressValue.updateIndexDb({
        tableName: "pre-loaded",
        key: `stressValue-child-${this.configureChildrenService.selectedChildId()}`,
      });
      this.breathingRate.updateIndexDb({
        tableName: "pre-loaded",
        key: `breathingRate-child-${this.configureChildrenService.selectedChildId()}`,
      });
      this.calories.updateIndexDb({
        tableName: "pre-loaded",
        key: `calories-child-${this.configureChildrenService.selectedChildId()}`,
      });
      this.sleepHours.updateIndexDb({
        tableName: "pre-loaded",
        key: `sleepHours-child-${this.configureChildrenService.selectedChildId()}`,
      });
    });
  }

  getHealthDetail(child: Child) {
    // const main = () => {
    const apiCall = this.apiService.apiCall("parent.child.health.get");
    apiCall.params = { childId: child.id };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          const healthData = apiCall.response?.data ?? {};
          this.heartRate.setValue(healthData.heartRate ?? [], {
            tableName: "pre-loaded",
            key: `heartRate-child-${child.id}`,
          });
          this.bodyTemperature.setValue(healthData.bodyTemperature ?? [], {
            tableName: "pre-loaded",
            key: `bodyTemperature-child-${child.id}`,
          });
          this.bloodPressure.setValue(healthData.bloodPressure ?? [], {
            tableName: "pre-loaded",
            key: `bloodPressure-child-${child.id}`,
          });
          this.breathingRate.setValue(healthData.breathingRate ?? [], {
            tableName: "pre-loaded",
            key: `breathingRate-child-${child.id}`,
          });
          this.calories.setValue(healthData.calories ?? [], {
            tableName: "pre-loaded",
            key: `calories-child-${child.id}`,
          });
          this.hrv.setValue(healthData.hrv ?? [], {
            tableName: "pre-loaded",
            key: `hrv-child-${child.id}`,
          });
          this.sleepHours.setValue(healthData.sleepHours ?? [], {
            tableName: "pre-loaded",
            key: `sleepHours-child-${child.id}`,
          });
          this.spo2.setValue(healthData.spo2 ?? [], {
            tableName: "pre-loaded",
            key: `spo2-child-${child.id}`,
          });
          this.stressValue.setValue(healthData.stressValue ?? [], {
            tableName: "pre-loaded",
            key: `stressValue-child-${child.id}`,
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
    // };

    // if (child.serverSetup?.value) {
    //   main();
    // } else {
    //   if (child.serverSetup?.subscribe) {
    //     child.serverSetup.subscribe(value => {
    //       if (value) {
    //         main();
    //       }
    //     });
    //   }
    // }
  }

  getOverallHealthMonthlyDetail(classLevelId?: string | number) {
    const defaultResponse = {
      heartRate: [],
      bodyTemperature: [],
      bloodPressure: [],
      breathingRate: [],
      calories: [],
      hrv: [],
      sleepHours: [],
      spo2: [],
      stressValue: [],
      timestamp: [],
    };

    return new Promise((resolve, reject) => {
      const apiCall = this.apiService.apiCall("parent.child.health.getAllSchoolStudentsHealthMonthly");
      apiCall.params = { classLevelId: classLevelId };
      apiCall.subject.subscribe({
        next: async () => {
          resolve(apiCall.response?.data ?? defaultResponse);
          if (apiCall.response?.status !== "OK") {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async err => {
          resolve(apiCall.response?.data ?? defaultResponse);
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
  getOverallHealthDailyDetail(month?: string | number, classLevelId?: string | number) {
    const defaultResponse = {
      heartRate: [],
      bodyTemperature: [],
      bloodPressure: [],
      breathingRate: [],
      calories: [],
      hrv: [],
      sleepHours: [],
      spo2: [],
      stressValue: [],
      timestamp: [],
    };

    return new Promise((resolve, reject) => {
      const apiCall = this.apiService.apiCall("parent.child.health.getAllSchoolStudentsHealthDaily");
      apiCall.params = { classLevelId: classLevelId, month: month ?? new Date().getMonth() + 1 };
      apiCall.subject.subscribe({
        next: async () => {
          resolve(apiCall.response?.data ?? defaultResponse);
          if (apiCall.response?.status !== "OK") {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async err => {
          resolve(apiCall.response?.data ?? defaultResponse);
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
  getHealthDetailDaily(child: Child, month?: string | number, classLevelId?: string | number) {
    const defaultResponse = {
      heartRate: [],
      bodyTemperature: [],
      bloodPressure: [],
      breathingRate: [],
      calories: [],
      hrv: [],
      sleepHours: [],
      spo2: [],
      stressValue: [],
      timestamp: [],
    };

    return new Promise((resolve, reject) => {
      const apiCall = this.apiService.apiCall("parent.child.health.getHealthDaily");
      apiCall.params = { childId: child.id, month: month ?? new Date().getMonth() + 1, classLevelId: classLevelId };
      apiCall.subject.subscribe({
        next: async () => {
          resolve(apiCall.response?.data ?? defaultResponse);
          if (apiCall.response?.status === "OK") {
            const healthData = apiCall.response?.data ?? {};
            this.heartRate.setValue(healthData.heartRate ?? [], {
              tableName: "pre-loaded",
              key: `heartRate-child-${child.id}`,
            });
            this.bodyTemperature.setValue(healthData.bodyTemperature ?? [], {
              tableName: "pre-loaded",
              key: `bodyTemperature-child-${child.id}`,
            });
            this.bloodPressure.setValue(healthData.bloodPressure ?? [], {
              tableName: "pre-loaded",
              key: `bloodPressure-child-${child.id}`,
            });
            this.breathingRate.setValue(healthData.breathingRate ?? [], {
              tableName: "pre-loaded",
              key: `breathingRate-child-${child.id}`,
            });
            this.calories.setValue(healthData.calories ?? [], {
              tableName: "pre-loaded",
              key: `calories-child-${child.id}`,
            });
            this.hrv.setValue(healthData.hrv ?? [], {
              tableName: "pre-loaded",
              key: `hrv-child-${child.id}`,
            });
            this.sleepHours.setValue(healthData.sleepHours ?? [], {
              tableName: "pre-loaded",
              key: `sleepHours-child-${child.id}`,
            });
            this.spo2.setValue(healthData.spo2 ?? [], {
              tableName: "pre-loaded",
              key: `spo2-child-${child.id}`,
            });
            this.stressValue.setValue(healthData.stressValue ?? [], {
              tableName: "pre-loaded",
              key: `stressValue-child-${child.id}`,
            });
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async err => {
          resolve(apiCall.response?.data ?? defaultResponse);
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
  getHealthDetailMonthly(child: Child, classLevelId?: string | number) {
    const defaultResponse = {
      heartRate: [],
      bodyTemperature: [],
      bloodPressure: [],
      breathingRate: [],
      calories: [],
      hrv: [],
      sleepHours: [],
      spo2: [],
      stressValue: [],
      timestamp: [],
    };

    return new Promise((resolve, reject) => {
      const apiCall = this.apiService.apiCall("parent.child.health.getHealthMonthly");
      apiCall.params = { childId: child.id, classLevelId: classLevelId };
      apiCall.subject.subscribe({
        next: async () => {
          resolve(apiCall.response?.data ?? defaultResponse);
          if (apiCall.response?.status === "OK") {
            const healthData = apiCall.response?.data ?? {};
            this.heartRate.setValue(healthData.heartRate ?? [], {
              tableName: "pre-loaded",
              key: `heartRate-child-${child.id}`,
            });
            this.bodyTemperature.setValue(healthData.bodyTemperature ?? [], {
              tableName: "pre-loaded",
              key: `bodyTemperature-child-${child.id}`,
            });
            this.bloodPressure.setValue(healthData.bloodPressure ?? [], {
              tableName: "pre-loaded",
              key: `bloodPressure-child-${child.id}`,
            });
            this.breathingRate.setValue(healthData.breathingRate ?? [], {
              tableName: "pre-loaded",
              key: `breathingRate-child-${child.id}`,
            });
            this.calories.setValue(healthData.calories ?? [], {
              tableName: "pre-loaded",
              key: `calories-child-${child.id}`,
            });
            this.hrv.setValue(healthData.hrv ?? [], {
              tableName: "pre-loaded",
              key: `hrv-child-${child.id}`,
            });
            this.sleepHours.setValue(healthData.sleepHours ?? [], {
              tableName: "pre-loaded",
              key: `sleepHours-child-${child.id}`,
            });
            this.spo2.setValue(healthData.spo2 ?? [], {
              tableName: "pre-loaded",
              key: `spo2-child-${child.id}`,
            });
            this.stressValue.setValue(healthData.stressValue ?? [], {
              tableName: "pre-loaded",
              key: `stressValue-child-${child.id}`,
            });
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async err => {
          resolve(apiCall.response?.data ?? defaultResponse);
          this.alertService.error(err.message || "Something went wrong");
        },
      });

      apiCall.exe().subscribe();
    });
  }
  clearHealthData() {
    this.heartRate.setValue([]);
    this.bodyTemperature.setValue([]);
    this.bloodPressure.setValue([]);
    this.breathingRate.setValue([]);
    this.calories.setValue([]);
    this.hrv.setValue([]);
    this.sleepHours.setValue([]);
    this.spo2.setValue([]);
    this.stressValue.setValue([]);
  }
  getAllHealthSymptoms(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getHealthSymptoms);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.healthSymptoms.setValue(await Health.createFromArray(apiCall.response.data));
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
  addHealthSymptoms({ symptomName, file }: { symptomName: string; file: File }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.addHealthSymptoms);
    apiCall.data = { symptomName, file };
    apiCall.formData = true;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  updateHealthSymptoms({ id, symptomName, file }: { id: number; symptomName: string; file: File }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateHealthSymptoms);
    apiCall.data = { id, symptomName, file };
    apiCall.formData = true;
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  deleteHealthSymptoms(id: number, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteHealthSymptoms);
    apiCall.data = { id };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
