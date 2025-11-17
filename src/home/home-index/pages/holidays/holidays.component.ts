/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, coreSignal, RequestLoader, RippleButtonDirective } from "@jot143/core-angular";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { takeUntil } from "rxjs";
import { BaseComponent } from "../../../../app/common/base.component";
import { AvatarService } from "../../../../app/services/avatar.service";
import { HolidaySchedulingService } from "../../../../app/services/holiday-scheduling.service";
import { MeetingService } from "../../../../app/services/meeting.service";
import { TeacherByClassSchedulingService } from "../../../../app/services/teacher-by-class-scheduling.service";
import { HolidayFilterPipe } from "../../pipes/holiday-filter.pipe";
import { LoaderComponent } from "../loader/loader.component";
import { MeetingCalendarComponent } from "../meeting-calendar/meeting-calendar.component";
import { SubmitOnEnterDirective } from "../../../../app/shared/directives/submit-on-enter.directive";
import { InputComponent } from "../../../../app/ngx-components/input/input.component";
import { DataNotFoundComponent } from "../data-not-found/data-not-found.component";

@Component({
  selector: "app-holidays",
  imports: [
    RippleButtonDirective,
    CommonModule,
    FormsModule,
    MeetingCalendarComponent,
    ReactiveFormsModule,
    HolidayFilterPipe,
    InputComponent,
    LoaderComponent,
    SubmitOnEnterDirective,
    DataNotFoundComponent,
  ],
  providers: [BsModalService],
  templateUrl: "./holidays.component.html",
  styleUrl: "./holidays.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidaysComponent extends BaseComponent implements OnInit {
  override title: string = "Holidays";
  @ViewChild("deleteEventModal") deleteEventModal!: TemplateRef<any>;
  meetingEvents: any;
  modalService = inject(BsModalService);
  holidayService = inject(HolidaySchedulingService);
  alertService = inject(AlertService);
  teacherScheduleService = inject(TeacherByClassSchedulingService);
  meetingService = inject(MeetingService);
  avatarService = inject(AvatarService);
  cdr = inject(ChangeDetectorRef);
  openedModal!: BsModalRef;
  isSearchVisible = false;
  isCalendarOpen = true;
  teacherId = "1";
  allEvents: any[] = [];
  repeatPattern = coreSignal<string>("Does not repeat");
  loader = new RequestLoader();
  holidayFilterTerm = "";
  holidays = [
    {
      id: "v-pills-kg",
      name: "New Year's Day",
      date: "Jan 01, 2025",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Mexico_City_New_Years_2013%21_%288333128248%29.jpg",
      active: true,
    },
    {
      id: "v-pills-nurses",
      name: "Islamic New Year",
      date: "June 26, 2025",
      imageUrl: "https://thewordpoint.com/uploads/08/islamic-new-year.webp",
      active: false,
    },
    {
      id: "v-pills-teachers",
      name: "Eid al-Fitar",
      date: "Mar 31, 2025",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Eid_al-Fitr_prayer%2C_Suleymaniye_Mosque%2C_Istanbul_-_Aug_30%2C_2011.jpg",
      active: false,
    },
    {
      id: "v-pills-technology",
      name: "Mawlid",
      date: "Sep 04, 2025",
      imageUrl: "https://i.pinimg.com/736x/35/75/f8/3575f8d7253b3494260ab838f3d423e8.jpg",
      active: false,
    },
    {
      id: "v-pills-assistant",
      name: "Day of Arafat",
      date: "Jun 05, 2025",
      imageUrl: "https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2024/03/27/Sheikh-Zayed-Grand-Mosque.jpg",
      active: false,
    },
  ];
  levelList = [
    { label: "Level 1", value: "Level 1" },
    { label: "Level 2", value: "Level 2" },
    { label: "Level 3", value: "Level 3" },
  ];
  holidayLoader = new RequestLoader();

  closeModal() {
    this.openedModal.hide();
  }

  openModal(modalDiv: any, type?: any) {
    this.openedModal = this.modalService.show(modalDiv, { class: "modal-dialog modal-dialog-centered team-meeting-modal" });
  }
  participants = [
    { name: "John Doe", image: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Mexico_City_New_Years_2013%21_%288333128248%29.jpg" },
    { name: "Jane Smith", image: "https://thewordpoint.com/uploads/08/islamic-new-year.webp" },
  ];

  repeatOptions = ["Does not repeat", "Every weekday (Mon - Fri)", "Daily", "Weekly", "Monthly", "Yearly", "Custom"];
  students = [
    { name: "Sayid", image: "/images/sayid.png", level: 1, class: "Dwer 11" },
    { name: "Kumar", image: "/images/kumar.png", level: 2, class: "Dwer 12" },
    { name: "Fathima", image: "/images/fathima.png", level: 3, class: "Dwer 13" },
    { name: "Muzammil", image: "/images/muzammil.png", level: 4, class: "Dwer 14" },
    { name: "Ali", image: "/images/ali.png", level: 5, class: "Dwer 15" },
    { name: "Zahra", image: "/images/zahra.png", level: 6, class: "Dwer 16" },
    { name: "Akmal", image: "/images/akmal.png", level: 7, class: "Dwer 17" },
    { name: "Ayisha", image: "/images/ayisha.png", level: 8, class: "Dwer 18" },
    { name: "Rahman", image: "/images/rahman.png", level: 9, class: "Dwer 19" },
    { name: "Kais", image: "/images/kais.png", level: 10, class: "Dwer 20" },
    { name: "Jabir", image: "/images/jabir.png", level: 11, class: "Dwer 01" },
    { name: "Sufin", image: "/images/sufin.png", level: 12, class: "Dwer 02" },
    { name: "Ami", image: "/images/ami.png", level: 13, class: "Dwer 03" },
    { name: "Sinan", image: "/images/sinan.png", level: 14, class: "Dwer 04" },
    { name: "Thomas", image: "/images/thomas.png", level: 15, class: "Dwer 05" },
  ];

  activeStudents: any[] = [...this.students]; // Initially, all students are selected

  daysMap: any = {
    SU: 0,
    MO: 1,
    TU: 2,
    WD: 3,
    TH: 4,
    FR: 5,
    SA: 6,
  };
  // Month Options
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // Week Options
  weekOptions = ["First", "Second", "Third", "Fourth", "Last"];

  // Day Options
  dayOptions = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  holidayForm = new FormGroup({
    title: new FormControl("", Validators.required),
    startDate: new FormControl("", Validators.required),
    startTime: new FormControl(""),
    endDate: new FormControl("", Validators.required),
    endTime: new FormControl(""),
    duration: new FormControl<any>("30m"),
    allDay: new FormControl(true),
    details: new FormControl(""),
  });
  ngOnInit(): void {
    this.holidayService.getAllHolidays(this.holidayLoader);

    const now = new Date();
    const startDate = this.formatDate(now);
    const startTime = this.formatTime(now);

    const end = new Date(now.getTime() + 30 * 60000); // +30 minutes
    const endDate = this.formatDate(end);
    const endTime = this.formatTime(end);

    this.holidayForm.patchValue({
      startDate,
      endDate,
      startTime,
      endTime,
    });

    this.listenToDurationFields();

    this.holidayForm
      .get("allDay")
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean | null) => {
        // Make sure the value is boolean before applying logic
        if (value === true) {
          const selectedStartDate = this.holidayForm.get("startDate")?.value;

          // Ensure startDate exists before patching values
          if (selectedStartDate) {
            this.holidayForm.patchValue({
              endDate: selectedStartDate, // Set endDate same as startDate
              startTime: "00:00", // Set startTime to midnight
              endTime: "23:59", // Set endTime to 11:59 PM
            });
          }
        }
      });

    this.holidayService.holidays.subject.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.allEvents = this.holidayService.holidays().flatMap((meeting: any) =>
        meeting.recurringDates.map((date: any) => ({
          id: meeting.id,
          title: meeting.title,
          start: new Date(date.start),
          end: new Date(date.end),
          namespace: meeting.namespace,
          allDay: false,
          extendedProps: {
            meetingId: meeting.id,
            namespace: meeting.namespace,
          },
        }))
      );

      this.cdr.markForCheck();
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5); // HH:mm
  }

  listenToDurationFields() {
    const fields = ["startDate", "endDate", "startTime", "endTime", "allDay"];
    fields.forEach(field => {
      this.holidayForm.get(field)?.valueChanges.subscribe(() => {
        this.updateDuration(); // Optional: if you want to also store duration in a control
      });
    });
  }
  updateDuration() {
    const duration = this.formatMeetingDuration();
    this.holidayForm.get("duration")?.setValue(duration);
  }

  async onTeacherClick(teacher: any) {
    this.teacherId = teacher.id;

    if (this.teacherId) {
      await this.meetingService.getAllMeetings(this.teacherId);
    }
  }
  get selectedRepeatDays(): number[] {
    return this.holidayForm.get("repeatDays")?.value || [];
  }

  showMeetingDetail() {
    this.isCalendarOpen = !this.isCalendarOpen;
    if (!this.isCalendarOpen) {
      this.holidayForm.patchValue({
        title: "",
        details: "",
      });
    }
  }

  addHoliday(): void {}
  formatMeetingDuration(): string {
    const startDate = this.holidayForm.get("startDate")?.value;
    let endDate = this.holidayForm.get("endDate")?.value;
    const allDay = this.holidayForm.get("allDay")?.value;

    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    let end = new Date(endDate);

    // If endDate is earlier than startDate, reset it to startDate
    if (end < start) {
      endDate = startDate;
      end = new Date(endDate);
      this.holidayForm.get("endDate")?.setValue(startDate);
    }

    if (allDay) {
      const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return `${durationDays}d`;
    }

    const startTime = this.holidayForm.get("startTime")?.value;
    const endTime = this.holidayForm.get("endTime")?.value;

    if (!startTime || !endTime) return "";

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime >= endDateTime) return "Invalid time range";

    const diff = (endDateTime.getTime() - startDateTime.getTime()) / 1000;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours === 0) result += `${minutes}m`;

    return result.trim();
  }
  setActiveStudent(student: any) {
    const index = this.activeStudents.indexOf(student);
    if (index > -1) {
      this.activeStudents.splice(index, 1); // Remove if exists
    } else {
      this.activeStudents.push(student); // Add if not exists
    }
  }

  isActive = false;
  searchTerm = "";

  get filteredStudents() {
    return this.students.filter(student => student.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Automatically toggle 'active' based on input value
  updateActiveState() {
    this.isActive = this.searchTerm.trim().length > 0;
  }

  onSelect(studentName: string) {
    this.searchTerm = studentName; // Set the student's name in the input field
    this.isActive = false; // Close the dropdown after selection
  }

  isShowed = false;

  toggleActive(isShowed: boolean) {
    this.isShowed = isShowed;
  }
  async onSubmit() {
    this.holidayForm.markAllAsTouched();
    if (this.holidayForm.get("title")?.value == "") {
      this.alertService.error("Please fill all the required fields.");
      return;
    }
    if (this.holidayForm.invalid) {
      this.alertService.error("Please fill all the required fields.");
      return;
    }

    // if (this.holidayForm.valid) {
    // const calendarForm: any = this.meetingCalendarForm.value;
    const holidayForm: any = this.holidayForm.value;
    const startDateTime = holidayForm.startDate;
    const endDateTime = holidayForm.endDate;

    // const metaData = [];

    // if (holidayForm.duration) {
    //   metaData.push({ key: "duration", value: holidayForm.duration.toString() });
    // }

    // if (holidayForm.details) {
    //   metaData.push({ key: "details", value: holidayForm.details.toString() });
    // }
    const payload: any = {
      title: holidayForm.title || "Holiday",
      startDate: startDateTime,
      endDate: endDateTime,
      // metaData: metaData,
    };

    const apiCall = await this.holidayService.createMeeting(payload, this.loader);
    apiCall.subject.subscribe({
      next: () => {
        if (apiCall.response.status === "OK") {
          this.alertService.success(apiCall.response.message || "Holiday Added successfully");
          this.resetForm(); // Close the modal
          this.isCalendarOpen = true;
          this.holidayService.getAllHolidays();
          // this.getAllTeacherData(); // Refresh the list after adding
        } else {
          this.alertService.error(apiCall.response.message || "Failed to add holiday");
        }
      },
      error: err => {
        this.alertService.error(err.message || "Failed to add Holiday");
      },
    });
    // }
  }

  close() {
    this.isCalendarOpen = true;
  }
  resetForm() {
    const now = new Date();
    const startDate = this.formatDate(now);
    const startTime = this.formatTime(now);

    const end = new Date(now.getTime() + 30 * 60000); // +30 minutes
    const endDate = this.formatDate(end);
    const endTime = this.formatTime(end);

    this.holidayForm = new FormGroup({
      title: new FormControl("", Validators.required),
      startDate: new FormControl(startDate, Validators.required),
      startTime: new FormControl(startTime),
      endDate: new FormControl(endDate, Validators.required),
      endTime: new FormControl(endTime),
      duration: new FormControl<any>("30m"),
      allDay: new FormControl(true),
      details: new FormControl(""),
    });

    // If allDay is true, set the time values
    if (this.holidayForm.get("allDay")?.value) {
      this.holidayForm.patchValue({
        startTime: "00:00",
        endTime: "23:59",
      });
    }
  }
  combineDateAndTime(date: string, time: string): string {
    return `${date}T${time}:00`;
  }

  deleteEvent(info: any) {
    const event = info.event;
    this.meetingEvents = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: event.extendedProps,
    };

    this.openedModal = this.modalService.show(this.deleteEventModal, { class: "modal-dialog modal-dialog-centered appointment-delete-modal" });
  }

  async deleteOccurrence() {
    const payload = {
      id: this.meetingEvents.id,
      start: this.meetingEvents.start.toISOString(),
      end: this.meetingEvents.end.toISOString(),
    };
    const apiCall = await this.holidayService.deleteOccurrence(payload, this.loader);
    apiCall.subject.subscribe({
      next: () => {
        if (apiCall.response.status === "OK") {
          this.alertService.success(apiCall.response.message || "Meeting deleted successfully");
        } else {
          this.alertService.error(apiCall.response.message || "Failed to delete meeting");
        }
      },
      error: () => {
        this.alertService.error(apiCall.response.message || "Failed to delete meeting");
      },
    });
  }

  async deleteSeries() {
    const payload = {
      id: this.meetingEvents.id,
    };
    const apiCall = await this.holidayService.deleteSeries(payload, this.loader);
    apiCall.subject.subscribe({
      next: () => {
        if (apiCall.response.status === "OK") {
          this.alertService.success(apiCall.response.message || "Meeting deleted successfully");
        } else {
          this.alertService.error(apiCall.response.message || "Failed to delete meeting");
        }
      },
      error: () => {
        this.alertService.error(apiCall.response.message || "Failed to delete meeting");
      },
    });
  }
}
