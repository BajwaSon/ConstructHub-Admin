/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getDashboardMetrics: "school.kpi.getDashboardMetrics",
    getMonthlyChartData: "school.attendance.getMonthly",
    getDailyChartData: "school.attendance.getDaily",
  };

  kpiCount = {
    students: coreSignal(0),
    teachers: coreSignal(0),
    busAssistants: coreSignal(0),
    staff: coreSignal(0),
    nurses: coreSignal(0),
  };

  // Api Call
  getDashboardMetrics(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getDashboardMetrics);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          const kpiCount = apiCall.response.data;
          this.kpiCount.students.setValue(kpiCount.students);
          this.kpiCount.teachers.setValue(kpiCount.teachers);
          this.kpiCount.staff.setValue(kpiCount.staff);
          this.kpiCount.busAssistants.setValue(kpiCount.busAssistant);
          this.kpiCount.nurses.setValue(kpiCount.nurses);

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

  // Api Call
  getMonthlyChartData(): Promise<any> {
    const data = [
      {
        name: "Site Staff",
        data: [
          {
            x: "2024-09",
            y: 0,
          },
          {
            x: "2024-10",
            y: 0,
          },
          {
            x: "2024-11",
            y: 0,
          },
          {
            x: "2024-12",
            y: 0,
          },
          {
            x: "2025-01",
            y: 0,
          },
          {
            x: "2025-03",
            y: 98.67,
          },
          {
            x: "2025-03",
            y: 98.67,
          },
          {
            x: "2025-04",
            y: 98.55,
          },
          {
            x: "2025-05",
            y: 98.91,
          },
          {
            x: "2025-06",
            y: 99.11,
          },
          {
            x: "2025-07",
            y: 0,
          },
          {
            x: "2025-08",
            y: 0,
          },
        ],
      },
      {
        name: "Safety & Security",
        data: [
          {
            x: "2024-09",
            y: 0,
          },
          {
            x: "2024-10",
            y: 0,
          },
          {
            x: "2024-11",
            y: 0,
          },
          {
            x: "2024-12",
            y: 0,
          },
          {
            x: "2025-01",
            y: 0,
          },
          {
            x: "2025-03",
            y: 98.13,
          },
          {
            x: "2025-03",
            y: 98.13,
          },
          {
            x: "2025-04",
            y: 98.55,
          },
          {
            x: "2025-05",
            y: 97.82,
          },
          {
            x: "2025-06",
            y: 97.56,
          },
          {
            x: "2025-07",
            y: 0,
          },
          {
            x: "2025-08",
            y: 0,
          },
        ],
      },
    ];

    return Promise.resolve(data);
  }

  // Api Call
  getDailyChartData(month?: string | number): Promise<any> {
    const data = [
      {
        name: "Site Staff",
        data: [
          {
            x: "2025-08-01",
            y: 0,
          },
          {
            x: "2025-08-02",
            y: 0,
          },
          {
            x: "2025-08-03",
            y: 0,
          },
          {
            x: "2025-08-04",
            y: 0,
          },
          {
            x: "2025-08-05",
            y: 0,
          },
          {
            x: "2025-08-06",
            y: 0,
          },
          {
            x: "2025-08-07",
            y: 0,
          },
          {
            x: "2025-08-08",
            y: 0,
          },
          {
            x: "2025-08-09",
            y: 0,
          },
          {
            x: "2025-08-10",
            y: 0,
          },
          {
            x: "2025-08-11",
            y: 0,
          },
          {
            x: "2025-08-12",
            y: 0,
          },
          {
            x: "2025-08-13",
            y: 0,
          },
          {
            x: "2025-08-14",
            y: 0,
          },
          {
            x: "2025-08-15",
            y: 0,
          },
          {
            x: "2025-08-16",
            y: 0,
          },
          {
            x: "2025-08-17",
            y: 0,
          },
          {
            x: "2025-08-18",
            y: 0,
          },
          {
            x: "2025-08-19",
            y: 0,
          },
          {
            x: "2025-08-20",
            y: 0,
          },
          {
            x: "2025-08-21",
            y: 0,
          },
          {
            x: "2025-08-22",
            y: 0,
          },
          {
            x: "2025-08-23",
            y: 0,
          },
          {
            x: "2025-08-24",
            y: 0,
          },
          {
            x: "2025-08-25",
            y: 0,
          },
          {
            x: "2025-08-26",
            y: 0,
          },
          {
            x: "2025-08-27",
            y: 0,
          },
          {
            x: "2025-08-28",
            y: 0,
          },
          {
            x: "2025-08-29",
            y: 0,
          },
          {
            x: "2025-08-30",
            y: 0,
          },
          {
            x: "2025-08-31",
            y: 0,
          },
        ],
      },
      {
        name: "Safety & Security",
        data: [
          {
            x: "2025-08-01",
            y: 0,
          },
          {
            x: "2025-08-02",
            y: 0,
          },
          {
            x: "2025-08-03",
            y: 0,
          },
          {
            x: "2025-08-04",
            y: 0,
          },
          {
            x: "2025-08-05",
            y: 0,
          },
          {
            x: "2025-08-06",
            y: 0,
          },
          {
            x: "2025-08-07",
            y: 0,
          },
          {
            x: "2025-08-08",
            y: 0,
          },
          {
            x: "2025-08-09",
            y: 0,
          },
          {
            x: "2025-08-10",
            y: 0,
          },
          {
            x: "2025-08-11",
            y: 0,
          },
          {
            x: "2025-08-12",
            y: 0,
          },
          {
            x: "2025-08-13",
            y: 0,
          },
          {
            x: "2025-08-14",
            y: 0,
          },
          {
            x: "2025-08-15",
            y: 0,
          },
          {
            x: "2025-08-16",
            y: 0,
          },
          {
            x: "2025-08-17",
            y: 0,
          },
          {
            x: "2025-08-18",
            y: 0,
          },
          {
            x: "2025-08-19",
            y: 0,
          },
          {
            x: "2025-08-20",
            y: 0,
          },
          {
            x: "2025-08-21",
            y: 0,
          },
          {
            x: "2025-08-22",
            y: 0,
          },
          {
            x: "2025-08-23",
            y: 0,
          },
          {
            x: "2025-08-24",
            y: 0,
          },
          {
            x: "2025-08-25",
            y: 0,
          },
          {
            x: "2025-08-26",
            y: 0,
          },
          {
            x: "2025-08-27",
            y: 0,
          },
          {
            x: "2025-08-28",
            y: 0,
          },
          {
            x: "2025-08-29",
            y: 0,
          },
          {
            x: "2025-08-30",
            y: 0,
          },
          {
            x: "2025-08-31",
            y: 0,
          },
        ],
      },
    ];

    return Promise.resolve(data);
  }
}
