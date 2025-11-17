/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BaseComponent, coreSignal, ViewportObserverDirective } from "@jot143/core-angular";

import { NgApexchartsModule } from "ng-apexcharts";
import { combineLatest, takeUntil, debounceTime, Subject, distinctUntilChanged } from "rxjs";
import { monthOptions } from "../../../../../app/common/options/months";
import { Child } from "../../../../../app/model/Child";
import { AttendanceService } from "../../../../../app/services/child/attendance.service";
import { ConfigureChildrenService } from "../../../../../app/services/child/configure-children.service";
import { ConfigureSectionService } from "../../../../../app/services/child/configure-section.service";
import { SelectDropdownComponent } from "../../../../components/select-dropdown/select-dropdown.component";
import { stack } from "three/src/nodes/TSL.js";

@Component({
  selector: "app-attendance-graph-card",
  imports: [FormsModule, NgApexchartsModule, ViewportObserverDirective, SelectDropdownComponent],
  templateUrl: "./attendance-graph-card.component.html",
  styleUrl: "./attendance-graph-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceGraphCardComponent extends BaseComponent implements OnInit {
  override title: string = "Attendance Graph Card";
  private attendanceService = inject(AttendanceService);
  private configureChildrenService = inject(ConfigureChildrenService);
  cdr = inject(ChangeDetectorRef);
  @Input() classLevelId = coreSignal<string | number>("");
  @Input() classSectionId = coreSignal<string | number>("");

  showMonthSelect = false;
  private configureSectionService = inject(ConfigureSectionService);
  attendanceMonthlyData = coreSignal<any[]>([]);
  timeRange = [
    { label: "Monthly", value: "Monthly" },
    { label: "Daily", value: "Daily" },
  ];

  // Fetch translated months
  monthCategories = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  monthOptions = monthOptions;
  getCurrentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  selectedMonth = coreSignal(monthOptions.find(option => option.value === this.getCurrentMonth) || monthOptions[0]);

  chartSeriesData = coreSignal<{ name: string; data: any; color: string; fillColor: string }[]>([
    {
      name: "Attendance",
      data: [],
      color: "#000",
      fillColor: "#000",
    },
  ]);
  dummySeries = [
    {
      name: "Attendance",
      data: [],
      color: "#000",
      fillColor: "#fff",
    },
  ];
  chartOptions: {
    chart: any;
    stroke: any;
    fill: any;
    xaxis: any;
    yaxis: any;
    dataLabels: any;
    tooltip: any;
    title: any;
    series: any;
    colors: any;
    plotOptions: any;
    legend: any;
    grid: any;
  } = {
    chart: {
      type: "area",
      height: 250,
      stacked: false,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      style: {
        fontFamily: "Host Grotesk, serif",
        fontSize: "12px",
        background: "#fff",
      },
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    series: [],
    xaxis: {
      categories: this.monthCategories,
      labels: {
        show: true,
        style: {
          fontFamily: "Host Grotesk, serif",
          fontSize: "12px",
          colors: "#666",
        },
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: true,
        color: "#78909C",
        height: 1,
        width: "100%",
      },
      axisTicks: {
        show: true,
        color: "#78909C",
        height: 6,
      },
    },
    colors: ["#4DE1C1", "#6b97db"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "80%",
      },
    },
    grid: {
      show: true,
      borderColor: "#90A4AE",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: true,
          color: "#90A4AE",
          opacity: 0.5,
        },
      },
      yaxis: {
        lines: {
          show: true,
          color: "#90A4AE",
          opacity: 0.5,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    yaxis: {
      title: {
        text: "Number of Students",
        style: {
          fontFamily: "'Host Grotesk', serif",
          fontSize: "12px",
          letterSpacing: "0.48px",
          colors: "#000",
        },
      },
      // min: 0,
      labels: {
        show: true,
        formatter: function (value: number) {
          return Math.round(value).toString();
        },
        style: {
          fontFamily: "Host Grotesk, serif",
          fontSize: "12px",
        },
      },
    },
    // yaxis: [
    //   {
    //     title: {
    //       text: "Number of students",
    //       style: {
    //         fontFamily: "'Host Grotesk', serif",
    //         fontSize: "12px",
    //         letterSpacing: "0.48px",
    //         colors: "#000",
    //       },
    //     },
    //     min: 0,

    //     labels: {
    //       show: true,
    //       formatter: function (value: number) {
    //         return Math.round(Math.abs(value)).toString();
    //       },
    //       style: {
    //         fontFamily: "Host Grotesk, serif",
    //         fontSize: "12px",
    //         colors: "#666",
    //       },
    //     },
    //     axisBorder: {
    //       show: true,
    //       color: "#78909C",
    //       width: 1,
    //     },
    //     axisTicks: {
    //       show: true,
    //       color: "#78909C",
    //       width: 6,
    //     },
    //   },
    // ],
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      followCursor: false,
      y: {
        formatter: function (value: number, { series, seriesIndex, dataPointIndex, w }: any) {
          if (w.config.series[seriesIndex].name === "Absent") {
            return Math.round(Math.abs(value));
          } else {
            return Math.round(value);
          }
        },
      },
      style: {
        fontFamily: "Host Grotesk, serif",
        fontSize: "12px",
      },
    },
    title: {
      text: "",
    },
  };
  private attendanceDetailSubject = new Subject<void>();

  ngOnInit(): void {
    // Set up debounced attendance detail fetching
    this.attendanceDetailSubject.pipe(debounceTime(1000), takeUntil(this.destroy$)).subscribe(() => {
      this.getAttendanceDetailMonthly();
    });

    combineLatest([this.configureSectionService.selectedChildren, this.selectedMonth.subject, this.classLevelId.subject, this.classSectionId.subject])
      .pipe(
        distinctUntilChanged((prev, curr) => {
          return JSON.stringify(prev) === JSON.stringify(curr);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.attendanceDetailSubject.next();
      });
    this.onTimeRangeChange({ value: "Monthly" });
  }

  get totalPresentDays(): number {
    const data = this.attendanceMonthlyData();
    // if (this.classLevelId() && this.classSectionId()) {
    const presentSeries = data.find((series: any) => series.name === "Presents");
    return presentSeries ? presentSeries.data.reduce((sum: number, point: any) => sum + point.y, 0) : 0;
    // }
    // return data.reduce((sum, entry) => sum + entry.present, 0);
  }

  get totalAbsentDays(): number {
    const data = this.attendanceMonthlyData();
    // if (this.classLevelId() && this.classSectionId()) {
    const absentSeries = data.find((series: any) => series.name === "Absent");
    return absentSeries ? absentSeries.data.reduce((sum: number, point: any) => sum + point.y, 0) : 0;
    // }
    // return data.reduce((sum, entry) => sum + entry.absent, 0);
  }

  getAttendanceSummary(): string {
    const data = this.attendanceMonthlyData();
    let totalPresentDays: number;
    let totalAbsentDays: number;

    // if (this.classLevelId() && this.classSectionId()) {
    const presentSeries = data.find((series: any) => series.name === "Presents");
    const absentSeries = data.find((series: any) => series.name === "Absent");

    totalPresentDays = presentSeries ? presentSeries.data.reduce((sum: number, point: any) => sum + point.y, 0) : 0;
    totalAbsentDays = absentSeries ? absentSeries.data.reduce((sum: number, point: any) => sum + point.y, 0) : 0;
    // }
    // else {
    //   totalPresentDays = data.reduce((sum, entry) => sum + entry.present, 0);
    //   totalAbsentDays = data.reduce((sum, entry) => sum + entry.absent, 0);
    // }

    const totalDays = totalPresentDays + totalAbsentDays;

    if (totalDays === 0) return "No Data";

    const percentage = Math.round((totalPresentDays / totalDays) * 100);

    // Determine label manually
    let label = "";
    if (percentage === 100) {
      label = "Outstanding";
    } else if (percentage >= 95) {
      label = "Excellent";
    } else if (percentage >= 90) {
      label = "Very Good";
    } else if (percentage >= 85) {
      label = "Good";
    } else if (percentage >= 80) {
      label = "Satisfactory";
    } else if (percentage >= 75) {
      label = "Unsatisfactory";
    } else {
      label = "Unacceptable";
    }

    return `${label} ${percentage}%`;
  }

  onMonthChange(event: { value: string; label: string }) {
    this.selectedMonth.setValue(event);
    this.onTimeRangeChange({ value: "Daily" });
  }
  onTimeRangeChange(selectedRange: any) {
    this.showMonthSelect = selectedRange.value === "Daily";
    this.attendanceDetailSubject.next();
    this.cdr.detectChanges();
  }
  getAttendanceDetailMonthly() {
    const child = this.configureSectionService.selectedChildren.value;
    const month = this.selectedMonth()?.value;
    const currentYear = new Date().getFullYear();
    const formattedMonth = `${currentYear}-${month}`;
    if (child && this.classSectionId() && this.classLevelId()) {
      if (this.showMonthSelect) {
        this.attendanceService.getChildAttendanceDaily(child, formattedMonth, this.classLevelId()).then((attendanceData: any) => {
          this.attendanceMonthlyData.setValue(attendanceData);
          this.loadChart();
        });
      } else {
        this.attendanceService.getAttendanceMonthly(child, this.classLevelId()).then((attendanceData: any) => {
          this.attendanceMonthlyData.setValue(attendanceData);
          this.loadChart();
        });
      }
    } else {
      if (this.showMonthSelect) {
        this.attendanceService.getOverallAttendanceDaily(this.classLevelId(), formattedMonth).then((attendanceData: any) => {
          this.attendanceMonthlyData.setValue(attendanceData);
          this.loadChart();
        });
      } else {
        this.attendanceService.getOverallAttendanceMonthly(this.classLevelId()).then((attendanceData: any) => {
          this.attendanceMonthlyData.setValue(attendanceData);
          this.loadChart();
        });
      }
    }
    // }
  }

  onVisibilityChange(isVisible: boolean) {
    if (isVisible) {
      this.loadChart();
    }
  }

  loadChart(): void {
    let data = this.attendanceMonthlyData();
    let newData: any;
    const monthValue: any = this.selectedMonth() || this.getCurrentMonth;
    const daysInMonth = new Date(new Date().getFullYear(), parseInt(monthValue.value), 0).getDate();

    // Find the Presents series
    const presentsSeries = data.find((series: any) => series.name === "Presents");
    const absentSeries = data.find((series: any) => series.name === "Absent");

    // Calculate max values for presents and absents
    const maxPresent = presentsSeries?.data.length > 0 ? Math.max(...presentsSeries.data.map((item: any) => item.y)) : 0;
    const maxAbsent = absentSeries?.data.length > 0 ? Math.max(...absentSeries.data.map((item: any) => Math.abs(item.y))) : 0;

    // Set y-axis limits
    // const yAxisMax = maxPresent + 10;
    // const yAxisMin = -maxAbsent;

    if (this.classLevelId() && this.classSectionId()) {
      if (this.showMonthSelect) {
        // For daily view, transform data to use custom categories
        const transformedData = data.map((series: any) => ({
          name: series.name === "Presents" ? "Present" : series.name,
          data: series.data.map((item: any) => ({
            x: `${monthValue.value}-${String(new Date(item.x).getDate()).padStart(2, "0")}`,
            y: item.y === 0 ? null : series.name === "Absent" ? -item.y : item.y,
          })),
        }));

        newData = {
          series: transformedData,
          categories: Array.from({ length: daysInMonth }, (_, i) => `${monthValue.value}-${String(i + 1).padStart(2, "0")}`),
        };
        this.chartOptions = {
          ...this.chartOptions,
          series: [newData.series.find((s: any) => s.name === "Present"), newData.series.find((s: any) => s.name === "Absent")],
          chart: {
            ...this.chartOptions.chart,
            type: "bar",
          },
          colors: ["#4DE1C1", "#6b97db"],
          fill: {
            type: "solid",
            opacity: 1,
          },
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: newData.categories,
          },
          yaxis: [
            {
              ...this.chartOptions.yaxis,
              title: { text: "Number of students", offsetX: 5, style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" } },
              // min: yAxisMin,
              // max: yAxisMax,
              labels: {
                show: true,
                formatter: function (value: number) {
                  return Math.round(Math.abs(value)).toString();
                },
                style: {
                  fontFamily: "Host Grotesk, serif",
                  fontSize: "12px",
                },
              },
            },
          ],
        };
      } else {
        const transformedData = data.map((series: any) => ({
          name: series.name === "Presents" ? "Present" : series.name,
          data: series.data.map((item: any, index: number) => ({
            x: this.monthCategories[index],
            y: item.y,
          })),
        }));

        newData = {
          series: transformedData,
          categories: this.monthCategories,
        };

        this.chartOptions = {
          ...this.chartOptions,
          series: newData.series,
          chart: {
            ...this.chartOptions.chart,
            type: "area",
            stacked: false,
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.3,
              stops: [0, 90, 100],
            },
          },
          colors: ["#4DE1C1", "#6b97db"],
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: newData.categories,
          },
          yaxis: [
            {
              ...this.chartOptions.yaxis,
              title: { text: "Number of students", offsetX: 5, style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" } },
              // min: 0,
              // max: yAxisMax,
              labels: {
                show: true,
                formatter: function (value: number) {
                  return Math.round(Math.abs(value)).toString();
                },
                style: {
                  fontFamily: "Host Grotesk, serif",
                  fontSize: "12px",
                },
              },
            },
          ],
        };
      }
    } else {
      if (this.showMonthSelect) {
        // For daily view, transform data to use custom categories
        const transformedData = data.map((series: any) => ({
          name: series.name === "Presents" ? "Present" : series.name,
          data: series.data.map((item: any) => ({
            x: `${monthValue.value}-${String(new Date(item.x).getDate()).padStart(2, "0")}`,
            y: item.y === 0 ? null : series.name === "Absent" ? -item.y : item.y,
          })),
        }));

        newData = {
          series: transformedData,
          categories: Array.from({ length: daysInMonth }, (_, i) => `${monthValue.value}-${String(i + 1).padStart(2, "0")}`),
        };
        this.chartOptions = {
          ...this.chartOptions,
          series: [newData.series.find((s: any) => s.name === "Present"), newData.series.find((s: any) => s.name === "Absent")],
          chart: {
            ...this.chartOptions.chart,
            type: "bar",
            stacked: true,
          },
          fill: {
            type: "solid",
            opacity: 1,
          },
          colors: ["#4DE1C1", "#6b97db"],
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: newData.categories,
          },
          yaxis: [
            {
              ...this.chartOptions.yaxis,
              title: { text: "Number of students", offsetX: 5, style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" } },
              // max: yAxisMax,
              // min: yAxisMin,
              labels: {
                show: true,
                formatter: function (value: number) {
                  return Math.round(Math.abs(value)).toString();
                },
                style: {
                  fontFamily: "Host Grotesk, serif",
                  fontSize: "12px",
                },
              },
            },
          ],
        };
      } else {
        const transformedData = data.map((series: any) => ({
          name: series.name === "Presents" ? "Present" : series.name,
          data: series.data.map((item: any, index: number) => ({
            x: this.monthCategories[index],
            y: item.y === 0 ? null : series.name === "Absent" ? -item.y : item.y,
          })),
        }));

        newData = {
          series: transformedData,
          categories: this.monthCategories,
        };
        this.chartOptions = {
          ...this.chartOptions,
          series: [newData.series.find((s: any) => s.name === "Present"), newData.series.find((s: any) => s.name === "Absent")],
          chart: {
            ...this.chartOptions.chart,
            type: "bar",
            stacked: true,
          },
          fill: {
            type: "solid",
            opacity: 1,
          },
          colors: ["#4DE1C1", "#6b97db"],
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: newData.categories,
          },
          yaxis: [
            {
              ...this.chartOptions.yaxis,
              title: { text: "Number of students", offsetX: 5, style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" } },
              // max: yAxisMax,
              // min: yAxisMin,
              labels: {
                show: true,
                formatter: function (value: number) {
                  return Math.round(Math.abs(value)).toString();
                },
                style: {
                  fontFamily: "Host Grotesk, serif",
                  fontSize: "12px",
                },
              },
            },
          ],
        };
      }
    }
    this.cdr.detectChanges();
  }
}
