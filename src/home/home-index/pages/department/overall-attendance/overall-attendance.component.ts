/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { coreSignal } from "@jot143/core-angular";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { monthOptions } from "../../../../../app/common/options/months";
import { DashboardService } from "../../../../../app/services/dashboard.service";
import { BaseComponent } from "../../../../../app/common/base.component";
import { SelectDropdownComponent } from "../../../../components/select-dropdown/select-dropdown.component";
import { CommonModule } from "@angular/common";
import { NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: "app-overall-attendance",
  imports: [SelectDropdownComponent, CommonModule, NgApexchartsModule],
  templateUrl: "./overall-attendance.component.html",
  styleUrl: "./overall-attendance.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallAttendanceComponent extends BaseComponent implements OnInit {
  override title = "Overall Attendance";

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  // static variables
  monthOptions = monthOptions;
  monthCategories = ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];
  timeRange = [
    { label: "Monthly", value: "Monthly" },
    { label: "Daily", value: "Daily" },
  ];

  showMonthSelect = false;
  chartDataSubject = new Subject<void>();
  getCurrentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  selectedMonth = coreSignal(monthOptions.find(option => option.value === this.getCurrentMonth) || monthOptions[0]);
  dailyCategories = Array.from({ length: 31 }, (_, i) => `01-${String(i + 1).padStart(2, "0")}`);

  chartOptions: any = {
    series: [],
    chart: {
      type: "bar",
      height: 300,
      zoom: {
        enabled: false,
      },
      toolbar: { show: false },
      fontFamily: "'Host Grotesk', serif",
    },
    colors: ["#8B8DF6", "#008dd1", "#4DE1C1", "#6b97db", "#d9d3f9"],
    plotOptions: { bar: { horizontal: false, columnWidth: "75%", borderRadius: 2, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false, style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", color: "#666" } },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: this.showMonthSelect ? this.monthCategories : this.dailyCategories,
      type: this.showMonthSelect ? "category" : "datetime",
      labels: {
        style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#666" },
        format: this.showMonthSelect ? "MMM" : "dd MMM",
        datetimeUTC: false,
      },
    },
    yaxis: {
      title: { text: "Percentage (%)", style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" } },
      min: 0,
      max: 100,
      // tickAmount: ,
      labels: {
        style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#000" },
        formatter: (value: number) => `${value}%`,
      },
      x: 10,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "'Host Grotesk', serif",
      fontSize: "16px",
      fontWeight: 400,
      labels: { colors: "#666", useSeriesColors: false, letterSpacing: "0.64px" },
      markers: { width: 10, height: 10, radius: 50, offsetX: -4 },
      itemMargin: { horizontal: 10, vertical: 0 },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
      x: {
        format: "MMM yyyy",
      },
    },
    fill: { opacity: 1 },
  };

  onMonthChange(selectedMonth: any) {
    this.selectedMonth.setValue(selectedMonth);
    this.onTimeRangeChange({ value: "Daily" });
  }

  onTimeRangeChange(selectedRange: any) {
    this.showMonthSelect = selectedRange.value === "Daily";
    this.chartDataSubject.next();
  }

  private async getOverallAttendance() {
    let data: any;

    if (this.showMonthSelect) {
      const monthValue: any = this.selectedMonth() || this.getCurrentMonth;
      const month = monthValue.value;
      const currentYear = new Date().getFullYear();
      const formattedMonth = `${currentYear}-${month}`;
      data = await this.dashboardService.getDailyChartData(formattedMonth);
      // Convert daily data x values to proper dates if needed
      const processedSeries = data.map((series: any) => ({
        ...series,
        data: series.data.map((point: any) => ({
          ...point,
          x: new Date(point.x).getTime(), // Convert YYYY-MM to timestamp
        })),
      }));
      data = { series: processedSeries };
    } else {
      data = await this.dashboardService.getMonthlyChartData();
      // Convert monthly data x values to proper dates
      const processedSeries = data.map((series: any) => ({
        ...series,
        data: series.data.map((point: any) => ({
          ...point,
          x: new Date(point.x + "-01").getTime(), // Convert YYYY-MM to timestamp
        })),
      }));
      data = { series: processedSeries };
    }

    this.chartOptions = {
      ...this.chartOptions,
      xaxis: {
        type: "datetime",
        labels: {
          style: { fontFamily: "'Host Grotesk', serif", fontSize: "12px", letterSpacing: "0.48px", colors: "#666" },
          format: this.showMonthSelect ? "dd MMM" : "MMM",
          datetimeUTC: false,
        },
      },
      series: data.series,
    };

    this.cdr.detectChanges();
  }

  callOverallAttendance() {
    this.chartDataSubject.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.getOverallAttendance();
    });
  }

  // end of overall attendance section

  ngOnInit() {
    this.callOverallAttendance();
  }
}
