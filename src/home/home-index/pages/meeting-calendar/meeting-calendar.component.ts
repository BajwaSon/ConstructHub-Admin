/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FullCalendarComponent, FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import { BsModalService } from "ngx-bootstrap/modal";
@Component({
  selector: "app-meeting-calendar",
  imports: [FullCalendarModule, CommonModule],
  templateUrl: "./meeting-calendar.component.html",
  styleUrl: "./meeting-calendar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingCalendarComponent implements OnInit, OnChanges {
  @ViewChild("tooltip", { static: true }) tooltipElement!: ElementRef;
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;

  // @Input() allEvents: any[] = [];
  @Input() set allEvents(events: any[]) {
    if (this.calendarComponent && this.calendarComponent.getApi()) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(events);
    }
  }

  @Output() deleteEvent: EventEmitter<any> = new EventEmitter<any>();

  private renderer: Renderer2 = inject(Renderer2);
  private cd = inject(ChangeDetectorRef);

  modalService = inject(BsModalService);

  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    events: [],
    eventColor: "#007BFF",
    editable: false,
    eventDidMount: (info: any) => this.addTooltip(info),
    eventClick: (info: any) => this.onDateClick(info),
    dayCellDidMount: arg => {
      const day = arg.date.getDay();
      if (day === 0 || day === 6) {
        this.renderer.setStyle(arg.el, "backgroundColor", "#f0f0f0");
      } else {
        // Monday to Friday
        this.renderer.setStyle(arg.el, "backgroundColor", "#f9f9f9");
      }
    },
  };

  ngOnInit(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.allEvents, // only if this.allEvents is already the actual array
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["allEvents"]) {
      const updatedEvents = changes["allEvents"].currentValue;
      const data = {
        ...this.calendarOptions,
        events: updatedEvents,
      };
      this.calendarOptions = data;
      this.cd.detectChanges();
    }
  }
  // onDateClick(arg: any) {
  //   this.dateClicked.emit(arg.dateStr);
  // }
  addTooltip(info: any): void {
    const tooltip = this.tooltipElement.nativeElement;
    const { bgColor, textColor } = this.generateColorsFromTitle(info.event.title);

    // Apply background and text color to the event element
    this.renderer.setStyle(info.el, "backgroundColor", bgColor);
    this.renderer.setStyle(info.el, "color", textColor);

    this.renderer.listen(info.el, "mouseover", (event: MouseEvent) => {
      this.renderer.setProperty(
        tooltip,
        "innerHTML",
        `<strong>${info.event.title}</strong><br>
        Namespace: ${info.event.extendedProps.namespace}<br>
        Time: ${info.event.start.toLocaleTimeString()} - ${info.event.end.toLocaleTimeString()}`
      );
      this.renderer.setStyle(tooltip, "display", "block");
      this.renderer.setStyle(tooltip, "backgroundColor", bgColor);
      this.renderer.setStyle(tooltip, "color", textColor);

      this.updateTooltipPosition(event);
    });

    this.renderer.listen(info.el, "mousemove", (event: MouseEvent) => {
      this.updateTooltipPosition(event);
    });

    this.renderer.listen(info.el, "mouseout", () => {
      this.renderer.setStyle(tooltip, "display", "none");
    });
  }

  updateTooltipPosition(event: MouseEvent): void {
    const tooltip = this.tooltipElement.nativeElement;
    this.renderer.setStyle(tooltip, "left", `${event.pageX + 10}px`);
    this.renderer.setStyle(tooltip, "top", `${event.pageY + 10}px`);
  }
  generateColorsFromTitle(title: string): { bgColor: string; textColor: string } {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    const saturation = 70;
    const lightness = 75; // balanced lightness, can go darker or lighter

    const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    // Convert HSL to RGB to determine luminance
    const { r, g, b } = this.hslToRgb(hue, saturation / 100, lightness / 100);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    const textColor = luminance < 0.6 ? "#000000" : "#000000";

    return { bgColor, textColor };
  }
  hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h / 360 + 1 / 3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, h / 360 - 1 / 3);
    }

    return { r, g, b };
  }

  onDateClick(info: any) {
    this.deleteEvent.emit(info);
  }
}
