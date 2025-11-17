import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-attendance-detail",
  imports: [],
  templateUrl: "./attendance-detail.component.html",
  styleUrl: "./attendance-detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceDetailComponent implements OnInit {
  monthYear: HTMLElement | null = null;
  daysContainer: HTMLElement | null = null;
  prevMonthButton: HTMLElement | null = null;
  nextMonthButton: HTMLElement | null = null;

  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentDate: Date = new Date();

  ngOnInit(): void {
    // Fetch UI Elements
    this.monthYear = document.getElementById("dateMonthYear");
    this.daysContainer = document.getElementById("calendarDays");
    this.prevMonthButton = document.getElementById("prevMonth");
    this.nextMonthButton = document.getElementById("nextMonth");

    // Initialize Calendar
    this.renderCalendar(this.currentDate);

    // Add Event Listeners
    if (this.prevMonthButton) {
      this.prevMonthButton.addEventListener("click", () => this.changeMonth(-1));
    }

    if (this.nextMonthButton) {
      this.nextMonthButton.addEventListener("click", () => this.changeMonth(1));
    }
  }

  renderCalendar(date: Date): void {
    if (!this.monthYear || !this.daysContainer) return;

    const year: number = date.getFullYear();
    const month: number = date.getMonth();

    // const monthKey = new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(year, month, 1)).toLowerCase();
    // this.translate.get(`attendance.months.${monthKey}`).subscribe((translatedMonth: string) => {
    //   this.monthYear!.textContent = `${translatedMonth || this.months[month]}, ${year}`;
    // });

    const firstDay: number = new Date(year, month, 1).getDay();
    const lastDate: number = new Date(year, month + 1, 0).getDate();

    this.daysContainer.innerHTML = "";

    // Create Empty Divs for Offset
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv: HTMLDivElement = document.createElement("div");
      this.daysContainer.appendChild(emptyDiv);
    }

    // Create Days
    for (let day = 1; day <= lastDate; day++) {
      const dayDiv: HTMLDivElement = document.createElement("div");
      dayDiv.textContent = day.toString();
      dayDiv.classList.add("day-item");

      if (day === 9 || day === 18) {
        dayDiv.classList.add("day-highlight");
      }

      this.daysContainer.appendChild(dayDiv);
    }
  }

  changeMonth(offset: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.renderCalendar(this.currentDate);
  }
}
