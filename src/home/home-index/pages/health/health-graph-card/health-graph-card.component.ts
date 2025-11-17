/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, inject, Input, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { coreSignal, PageComponent } from "@jot143/core-angular";
import { NgApexchartsModule } from "ng-apexcharts";
import { combineLatest, debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { AvatarService } from "../../../../../app/services/avatar.service";
import { ConfigureSectionService } from "../../../../../app/services/child/configure-section.service";
import { HealthService } from "../../../../../app/services/child/health.service";
import { environment } from "../../../../../environments/environment";
import { SelectDropdownComponent } from "../../../../components/select-dropdown/select-dropdown.component";
import { monthOptions } from "../../../../../app/common/options/months";

@Component({
  selector: "app-health-graph-card",
  imports: [FormsModule, CommonModule, NgApexchartsModule, SelectDropdownComponent],
  templateUrl: "./health-graph-card.component.html",
  styleUrl: "./health-graph-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthGraphCardComponent extends PageComponent implements OnInit {
  override title = "HealthGraphCardComponent";
  @ViewChild("stackedChartRef", { static: false }) stackedChartRef!: ElementRef;
  @Input() subjectsOptionShow = coreSignal(false);
  @Input() classLevelId = coreSignal<string | number>("");
  @Input() classSectionId = coreSignal<string | number>("");

  overallHealthData = coreSignal(null);
  // injectService
  private healthService = inject(HealthService);
  avatarService = inject(AvatarService);
  private configureSectionService = inject(ConfigureSectionService);
  cdr = inject(ChangeDetectorRef);
  showMonthSelect = false;
  monthOptions = monthOptions;
  timeRange = [
    { label: "Monthly", value: "Monthly" },
    { label: "Daily", value: "Daily" },
  ];

  getCurrentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  selectedMonth = coreSignal(monthOptions.find(option => option.value === this.getCurrentMonth) || monthOptions[0]);

  healthStats = [
    {
      name: "Heart Rate",
      value: () => {
        if (this.heartRate().length > 0) {
          const latestValue = this.heartRate()[this.heartRate().length - 1].value;
          return parseFloat(latestValue.toFixed(2));
        }
        return 0;
      },
      unit: "Bpm",
      icon: "assets/images/health-icon/heart-rate.svg",
      style: "border-color: var(--light-red-border); background-color: var(--light-red-bg)",
    },
    {
      name: "Body Temperature",
      value: () => {
        if (this.bodyTemperature().length > 0) {
          const latestValue = this.bodyTemperature()[this.bodyTemperature().length - 1].value;
          return parseFloat(latestValue.toFixed(2));
        }
        return 0;
      },
      unit: "<sup>o</sup>",
      icon: "assets/images/health-icon/body-temperature.svg",
      style: "border-color: var(--light-blue-border); background-color: var(--light-blue-bg)",
    },
    {
      name: "BP",
      value: () => {
        if (this.bloodPressure().length > 0) {
          const latestValue = this.bloodPressure()[this.bloodPressure().length - 1].value;
          return parseFloat(latestValue.toFixed(2));
        }
        return 0;
      },
      unit: "Bpm",
      icon: "assets/images/health-icon/bp.svg",
      style: "border-color: var(--light-green-border); background-color: var(--light-green-bg)",
    },
    {
      name: "HRV",
      value: () => {
        if (this.hrv().length > 0) {
          const latestValue = this.hrv()[this.hrv().length - 1].value;
          return parseFloat(latestValue.toFixed(2));
        }
        return 0;
      },
      unit: "<sup>o</sup>",
      icon: "assets/images/health-icon/hrv.svg",
      style: "border-color: var(--light-orange-border); background-color: var(--light-orange-bg)",
    },
    {
      name: "SPO2",
      value: () => {
        if (this.spo2().length > 0) {
          const latestValue = this.spo2()[this.spo2().length - 1].value;
          return parseFloat(latestValue.toFixed(2));
        }
        return 0;
      },
      unit: "%",
      icon: "assets/images/health-icon/spo2.svg",
      style: "border-color: var(--light-yellow-border); background-color: var(--light-yellow-bg)",
    },
    {
      name: "Stress Value",
      value: () => {
        const values = this.stressValue();
        if (values.length > 0) {
          const latestValue = values[values.length - 1].value;
          return parseFloat(latestValue.toFixed(2));
        }
        return 0;
      },
      unit: "psi",
      icon: "assets/images/health-icon/stress-value.svg",
      style: "border-color: var(--light-pink-border); background-color: var(--light-pink-bg)",
    },
    {
      name: "Breathing Rate",
      value: () => {
        if (this.breathingRate().length > 0) {
          const latestValue = this.breathingRate()[this.breathingRate().length - 1].value;
          return parseFloat(latestValue.toFixed(2));
        }
        return 0;
      },
      unit: "m",
      icon: "assets/images/health-icon/breathing-rate.svg",
      style: "border-color: var(--light-sky-border); background-color: var(--light-sky-bg)",
    },
    {
      name: "Calories",
      value: () => {
        if (this.calories().length > 0) {
          const latestValue = this.calories()[this.calories().length - 1].value;
          return parseFloat(latestValue.toFixed(2));
        }
        return 0;
      },
      unit: "%",
      icon: "assets/images/health-icon/calories.svg",
      style: "border-color: var(--light-shade-border); background-color: var(--light-shade-bg)",
    },
    {
      name: "Sleep",
      value: () => {
        if (this.sleepHours().length > 0) {
          const latestValue = this.sleepHours()[this.sleepHours().length - 1].value;
          return parseFloat(latestValue.toFixed(2));
        }
        return 0;
      },
      unit: "h",
      icon: "assets/images/health-icon/sleep.svg",
      style: "border-color: var(--light-darkblue-border); background-color: var(--light-darkblue-bg)",
    },
  ];
  monthCategories = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  heartRateStat = computed(() => {
    return this.healthStats.find(stat => stat.name === this.selectedHealthStat());
  });
  selectedHealthStat = coreSignal("Heart Rate");

  // health data
  heartRate = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `heartRate-child-${this.configureSectionService.selectedChildren}-month-${this.selectedMonth()?.value}`,
  });

  bodyTemperature = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `bodyTemperature-child-${this.configureSectionService.selectedChildren}-month-${this.selectedMonth()?.value}`,
  });

  bloodPressure = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `bloodPressure-child-${this.configureSectionService.selectedChildren}-month-${this.selectedMonth()?.value}`,
  });

  hrv = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `hrv-child-${this.configureSectionService.selectedChildren}-month-${this.selectedMonth()?.value}`,
  });

  spo2 = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `spo2-child-${this.configureSectionService.selectedChildren}-month-${this.selectedMonth()?.value}`,
  });

  stressValue = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `stressValue-child-${this.configureSectionService.selectedChildren}-month-${this.selectedMonth()?.value}`,
  });

  breathingRate = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `breathingRate-child-${this.configureSectionService.selectedChildren}-month-${this.selectedMonth()?.value}`,
  });

  calories = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `calories-child-${this.configureSectionService.selectedChildren}-month-${this.selectedMonth()?.value}`,
  });

  sleepHours = coreSignal<{ value: number; timestamp: number }[]>([], {
    tableName: "pre-loaded",
    key: `sleepHours-child-${this.configureSectionService.selectedChildren}-month-${this.selectedMonth()?.value}`,
  });
  dummyStackedData = {
    normal: [
      { value: 15, students: [] },
      { value: 18, students: [] },
      { value: 20, students: [] },
      { value: 17, students: [] },
      { value: 19, students: [] },
    ],
    abnormal: [
      { value: -5, students: [{ name: "John Doe", photo: "assets/images/student1.jpg", class: "Class 5A" }] },
      { value: -3, students: [{ name: "Jane Smith", photo: "assets/images/student2.jpg", class: "Class 5A" }] },
      { value: -2, students: [{ name: "Mike Johnson", photo: "assets/images/student3.jpg", class: "Class 5A" }] },
      { value: -4, students: [{ name: "Sarah Wilson", photo: "assets/images/student4.jpg", class: "Class 5A" }] },
      { value: -3, students: [{ name: "Tom Brown", photo: "assets/images/student5.jpg", class: "Class 5A" }] },
    ],
  };

  stackedChartData = coreSignal<{ name: string; data: any[]; color: string }[]>([
    {
      name: "Normal",
      data: [],
      color: "#8B8DF6",
    },
    {
      name: "Abnormal",
      data: [],
      color: "#008dd1",
    },
  ]);
  chartSeriesData = coreSignal<{ name: string; data: any; color: string; fillColor: string; fillOpacity: number; dataLabels: any }[]>([
    {
      name: this.selectedHealthStat(),
      data: [],
      color: "#000",
      fillColor: "#000",
      fillOpacity: 0.7,
      dataLabels: {
        enabled: false,
      },
    },
  ]);

  chartOptions: {
    chart: any;
    stroke: any;
    fill: any;
    xaxis: any;
    yaxis: any;
    dataLabels: any;
    tooltip: any;
    series: any;
    title: any;
  } = {
    chart: {
      height: 200,
      type: "area",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      // stacked: true,
    },
    stroke: {
      width: 1,
      curve: "smooth",
    },
    series: [],
    xaxis: {
      categories: this.monthCategories,
      // type: "datetime",
      labels: {
        show: true,
        style: {
          fontFamily: "Host Grotesk, serif",
          fontSize: "12px",
          color: "#666",
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    fill: { opacity: 1 },
    dataLabels: {
      enabled: false,
    },
    yaxis: [
      {
        title: { text: this.selectedHealthStat(), style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" } },
        min: 0,
        // max: 100,
        // tickAmount: 20,
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
    ],
    tooltip: {
      enabled: false,
      shared: false,
      y: {
        formatter: function (value: number) {
          return value.toFixed(2);
        },
      },
    },
    title: {
      text: "",
    },
  };

  // Add this after the existing chartOptions
  stackedChartOptions: {
    chart: any;
    stroke: any;
    fill: any;
    xaxis: any;
    yaxis: any;
    dataLabels: any;
    tooltip: any;
    title: any;
    plotOptions: any;
    legend: any;
    colors: any;
    series: any;
    dummyStackedData?: any;
  } = {
    chart: {
      height: 280,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["#4DE1C1", "#6b97db"],
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "80%",
      },
    },
    legend: {
      position: "bottom",
    },
    series: [],
    xaxis: {
      categories: this.monthCategories,
      labels: {
        show: true,
        style: {
          fontFamily: "Host Grotesk, serif",
          fontSize: "12px",
          color: "#666",
        },
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
    fill: {
      // opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: false,
      intersect: false,
      followCursor: true,
      hideDelay: 1000,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        // Get abnormal students data from the series
        const abnormalData = w.config.series[1].data[dataPointIndex];
        const abnormalStudents = abnormalData.students || [];
        let tooltipContent = `
          <div class="custom-tooltip">
            <div class="tooltip-title">Abnormal Students (${abnormalStudents.length})</div>
            <div class="students-list">
        `;

        if (abnormalStudents.length === 0) {
          tooltipContent += `
            <div class="no-students-message">
              No abnormal students found
            </div>
          `;
        } else {
          // Create student cards
          abnormalStudents.forEach((student: any) => {
            tooltipContent += `
              <div class="student-card">
                <div class="student-info">
                  ${
                    student.photo !== null
                      ? `<img src="${student.photo.startsWith("http") ? student.photo : environment.assetsUrl + student.photo}" alt="${student.name}" class="student-photo"/>`
                      : `<div class="avatar-circle-img flex-center-align initials-avatar">
                      ${student.name ? student.name.substring(0, 2).toUpperCase() : ""}
                    </div>`
                  }
                
                  <div class="student-details" style="margin-left:10px;">
                    <div class="student-name">${student.name}</div>
                    <div class="student-class">${student.class}</div>
                  </div>
                </div>
                <div class="student-details-expanded">
                  <div class="detail-item">
                    <span class="label">Health Status:</span>
                    <span class="value">Abnormal</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Last Check:</span>
                    <span class="value">${new Date().toLocaleDateString()}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Vitals:</span>
                    <span class="value">Heart Rate: 85 bpm</span>
                  </div>
                </div>
              </div>
            `;
          });
        }

        tooltipContent += `
            </div>
          </div>
        `;

        return tooltipContent;
      },
    },

    title: {
      text: "Student Health Status",
    },
  };

  private healthDetailSubject = new Subject<void>();

  ngOnInit() {
    // Set up debounced health detail fetching
    this.healthDetailSubject.pipe(debounceTime(1000), takeUntil(this.destroy$)).subscribe(() => {
      this.getHealthDetailMonthly();
    });

    // Watch for changes in all required values
    combineLatest([this.configureSectionService.selectedChildren, this.selectedMonth.subject, this.classLevelId.subject, this.classSectionId.subject])
      .pipe(
        distinctUntilChanged((prev, curr) => {
          return JSON.stringify(prev) === JSON.stringify(curr);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.healthDetailSubject.next();
      });

    this.onHealthStatClick(this.selectedHealthStat());
  }

  onMonthChange(event: { value: string; label: string }) {
    this.selectedMonth.setValue(event);
    this.onTimeRangeChange({ value: "Daily" });
  }

  async onTimeRangeChange(selectedRange: any) {
    this.showMonthSelect = selectedRange.value === "Daily";
    this.healthDetailSubject.next();
  }

  private getHealthDetailMonthly() {
    const child: any = this.configureSectionService.selectedChildren.value;
    const month = this.selectedMonth()?.value;
    const currentYear = new Date().getFullYear();
    const formattedMonth = `${currentYear}-${month}`;

    if (child && this.classSectionId() && this.classLevelId()) {
      if (this.showMonthSelect) {
        this.healthService.getHealthDetailDaily(child, formattedMonth, this.classLevelId()).then((healthData: any) => {
          this.heartRate.setValue(healthData?.heartRate ?? [], {
            tableName: "pre-loaded",
            key: `heartRate-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.bodyTemperature.setValue(healthData?.bodyTemperature ?? [], {
            tableName: "pre-loaded",
            key: `bodyTemperature-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.bloodPressure.setValue(healthData?.bloodPressure ?? [], {
            tableName: "pre-loaded",
            key: `bloodPressure-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.breathingRate.setValue(healthData?.breathingRate ?? [], {
            tableName: "pre-loaded",
            key: `breathingRate-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.calories.setValue(healthData?.calories ?? [], {
            tableName: "pre-loaded",
            key: `calories-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.hrv.setValue(healthData?.hrv ?? [], {
            tableName: "pre-loaded",
            key: `hrv-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.sleepHours.setValue(healthData?.sleepHours ?? [], {
            tableName: "pre-loaded",
            key: `sleepHours-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.spo2.setValue(healthData?.spo2 ?? [], {
            tableName: "pre-loaded",
            key: `spo2-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.stressValue.setValue(healthData?.stressValue ?? [], {
            tableName: "pre-loaded",
            key: `stressValue-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });

          this.loadChart();
        });
      } else {
        this.healthService.getHealthDetailMonthly(child, this.classLevelId()).then((healthData: any) => {
          this.heartRate.setValue(healthData?.heartRate ?? [], {
            tableName: "pre-loaded",
            key: `heartRate-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.bodyTemperature.setValue(healthData?.bodyTemperature ?? [], {
            tableName: "pre-loaded",
            key: `bodyTemperature-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.bloodPressure.setValue(healthData?.bloodPressure ?? [], {
            tableName: "pre-loaded",
            key: `bloodPressure-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.breathingRate.setValue(healthData?.breathingRate ?? [], {
            tableName: "pre-loaded",
            key: `breathingRate-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.calories.setValue(healthData?.calories ?? [], {
            tableName: "pre-loaded",
            key: `calories-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.hrv.setValue(healthData?.hrv ?? [], {
            tableName: "pre-loaded",
            key: `hrv-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.sleepHours.setValue(healthData?.sleepHours ?? [], {
            tableName: "pre-loaded",
            key: `sleepHours-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.spo2.setValue(healthData?.spo2 ?? [], {
            tableName: "pre-loaded",
            key: `spo2-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });
          this.stressValue.setValue(healthData?.stressValue ?? [], {
            tableName: "pre-loaded",
            key: `stressValue-child-${child.id}-month-${this.selectedMonth()?.value}`,
          });

          this.loadChart();
        });
      }
    } else {
      if (this.showMonthSelect) {
        this.healthService.getOverallHealthDailyDetail(formattedMonth, this.classLevelId()).then((healthData: any) => {
          this.overallHealthData.setValue(healthData);
          this.loadChart();
        });
      } else {
        this.healthService.getOverallHealthMonthlyDetail(this.classLevelId()).then((healthData: any) => {
          this.overallHealthData.setValue(healthData);
          this.loadChart();
        });
      }
    }
  }

  onHealthStatClick(stat: string): void {
    this.selectedHealthStat.setValue(stat);
    this.chartOptions.yaxis = [
      {
        title: { text: this.selectedHealthStat(), style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" } },
        min: 0,
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
    ];
    this.cdr.detectChanges();
    this.loadChart();
  }

  loadChart(): void {
    let data = this.heartRate();
    const monthValue: any = this.selectedMonth() || this.getCurrentMonth;
    const daysInMonth = new Date(new Date().getFullYear(), parseInt(monthValue.value), 0).getDate();

    let newData: any;

    if (this.classLevelId() && this.classSectionId()) {
      // Existing line chart logic

      switch (this.selectedHealthStat()) {
        case "Heart Rate":
          data = this.heartRate();
          break;
        case "Body Temperature":
          data = this.bodyTemperature();
          break;
        case "BP":
          data = this.bloodPressure();
          break;
        case "HRV":
          data = this.hrv();
          break;
        case "SPO2":
          data = this.spo2();
          break;
        case "Stress Value":
          data = this.stressValue();
          break;
        case "Breathing Rate":
          data = this.breathingRate();
          break;
        case "Calories":
          data = this.calories();
          break;
        case "Sleep":
          data = this.sleepHours();
          break;
        default:
          data = this.heartRate();
      }

      const colorMap: { [key: string]: { line: string; area: string } } = {
        "Heart Rate": { line: "#FF8383", area: "#fdefef" },
        "Body Temperature": { line: "#647ff4", area: "#ebeefa" },
        BP: { line: "#10D01C", area: "#ebeefa" },
        HRV: { line: "#F4AB67", area: "#e2fce4" },
        SPO2: { line: "#F4AB67", area: "#fff2e7" },
        "Stress Value": { line: "#E41EFE", area: "#ffefc1" },
        "Breathing Rate": { line: "#18BCD6", area: "#fdeeff" },
        Calories: { line: "#000", area: "#dcebed" },
        Sleep: { line: "#0039FF", area: "#dbe3ff" },
      };
      const colors = colorMap[this.selectedHealthStat()];
      if (this.showMonthSelect) {
        // Create a map of dates to values for the selected month
        const dateValueMap = new Map();
        data.forEach(item => {
          const date = new Date(item.timestamp);
          const day = String(date.getDate()).padStart(2, "0");
          dateValueMap.set(day, item.value);
        });

        // Create arrays for series and categories
        const series = [];
        const categories = [];

        for (let i = 1; i <= daysInMonth; i++) {
          const day = String(i).padStart(2, "0");
          categories.push(`${monthValue.value}-${day}`);
          series.push(dateValueMap.get(day) || 0);
        }

        newData = {
          series: [
            {
              name: this.selectedHealthStat(),
              data: series,
              color: colors.line,
              fillColor: colors.area,
              fillOpacity: 0.7,
              dataLabels: {
                enabled: false,
              },
            },
          ],
          categories: categories,
        };

        this.chartOptions = {
          ...this.chartOptions,
          series: newData.series,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: newData.categories,
          },
          yaxis: [
            {
              title: { text: this.selectedHealthStat(), offsetX: 10, style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" } },
              min: 0,
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
          ],
        };
        this.cdr.detectChanges();
      } else {
        // For monthly view, group data by month
        const monthData = new Map();
        data.forEach(item => {
          const date = new Date(item.timestamp);
          const month = date.getMonth();
          if (!monthData.has(month)) {
            monthData.set(month, []);
          }
          monthData.get(month).push(item.value);
        });

        // Calculate average for each month
        const series = this.monthCategories.map((_, index) => {
          const values = monthData.get(index) || [];
          return values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) / values.length : 0;
        });

        newData = {
          series: [
            {
              name: this.selectedHealthStat(),
              data: series,
              color: colors.line,
              fillColor: colors.area,
              fillOpacity: 0.7,
              dataLabels: {
                enabled: false,
              },
            },
          ],
          categories: this.monthCategories,
        };

        this.chartOptions = {
          ...this.chartOptions,
          series: newData.series,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: newData.categories,
          },
          yaxis: [
            {
              title: { text: this.selectedHealthStat(), style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" } },
              min: 0,
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
          ],
        };
        this.cdr.detectChanges();
      }
    } else {
      let data: any = this.overallHealthData();

      // Transform data to show normal values above 0 and abnormal values below 0
      let seriesData: any = [
        {
          name: "Normal",
          data:
            data?.normal?.map((item: any) => ({
              x: new Date(item.timestamp).getTime(),
              y: item.value,
              students: item.students,
            })) ?? [],
          color: "#4DE1C1",
        },
        {
          name: "Abnormal",
          data:
            data?.abnormal?.map((item: any) => ({
              x: new Date(item.timestamp).getTime(),
              y: item.value, // This will be negative, showing below 0
              students: item.students,
            })) ?? [],
          color: "#6b97db",
        },
      ];

      if (this.showMonthSelect) {
        this.stackedChartOptions = {
          ...this.stackedChartOptions,
          chart: {
            ...this.stackedChartOptions.chart,
            events: {
              mounted: (chart: any) => {
                chart.windowResizeHandler();
              },
            },
          },
          colors: ["#4DE1C1", "#6b97db"],
          dummyStackedData: data,
          yaxis: {
            ...this.stackedChartOptions.yaxis,
            // min: -10, // Adjust based on your data range
            // max: 30, // Adjust based on your data range
            labels: {
              formatter: (value: number) => Math.abs(value).toString(),
            },
          },
        };

        const transformedData = seriesData.map((series: any) => ({
          name: series.name,
          data: series.data.map((item: any) => ({
            x: new Date(item.x).toISOString().split("T")[0],
            y: item.y,
            students: item.students,
          })),
        }));

        newData = {
          series: transformedData,
          categories: Array.from({ length: daysInMonth }, (_, i) => `${monthValue.value}-${String(i + 1).padStart(2, "0")}`),
        };

        this.stackedChartOptions = {
          ...this.stackedChartOptions,
          series: newData.series,
          colors: ["#4DE1C1", "#6b97db"],
          xaxis: {
            ...this.stackedChartOptions.xaxis,
            categories: newData.categories,
          },
        };
      } else {
        this.stackedChartOptions = {
          ...this.stackedChartOptions,
          chart: {
            ...this.stackedChartOptions.chart,
            events: {
              mounted: (chart: any) => {
                chart.windowResizeHandler();
              },
            },
          },
          colors: ["#4DE1C1", "#6b97db"],
          dummyStackedData: data,
          yaxis: {
            ...this.stackedChartOptions.yaxis,
            // min: , // Adjust based on your data range
            // max: 30, // Adjust based on your data range
            labels: {
              formatter: (value: number) => Math.abs(value).toString(),
            },
          },
        };

        const transformedData = seriesData.map((series: any) => ({
          name: series.name,
          data: series.data.map((item: any) => ({
            x: new Date(item.x).toISOString().split("T")[0],
            y: item.y,
            students: item.students,
          })),
        }));

        newData = {
          series: transformedData,
          categories: this.monthCategories,
        };

        this.stackedChartOptions = {
          ...this.stackedChartOptions,
          series: newData.series,
          colors: ["#4DE1C1", "#6b97db"],
          xaxis: {
            ...this.stackedChartOptions.xaxis,
            categories: newData.categories,
          },
        };
      }
      this.cdr.detectChanges();
    }
  }
}
