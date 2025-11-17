/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, QueryList, Renderer2, ViewChildren } from "@angular/core";
// eslint-disable-next-line no-restricted-imports
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { ClickOutsideDirective, NavigationService, RippleButtonDirective } from "@jot143/core-angular";
import { PermissionDirective } from "../../../app/directives/permission.directive";
import { filter } from "rxjs";
import { AppService } from "../../../app/services/app.service";
import { trigger, state, style, animate, transition, keyframes } from "@angular/animations";

@Component({
  selector: "app-top-header",
  imports: [RippleButtonDirective, CommonModule, RouterModule],
  templateUrl: "./top-header.component.html",
  styleUrl: "./top-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("digitAnimation", [
      transition("* => *", [
        animate(
          "0.2s ease-in-out",
          keyframes([
            style({ transform: "scale(1)", opacity: 1, offset: 0 }),
            style({ transform: "scale(1.1)", opacity: 0.8, offset: 0.5 }),
            style({ transform: "scale(1)", opacity: 1, offset: 1 }),
          ])
        ),
      ]),
    ]),
    trigger("dateAnimation", [transition("* => *", [animate("0.3s ease-in-out", keyframes([style({ opacity: 0.7, offset: 0 }), style({ opacity: 1, offset: 1 })]))])]),
    trigger("timezoneAnimation", [transition("* => *", [animate("0.3s ease-in-out", keyframes([style({ opacity: 0.7, offset: 0 }), style({ opacity: 1, offset: 1 })]))])]),
  ],
})
export class TopHeaderComponent implements OnInit {
  @Input() isSearchVisible?: boolean = false;
  isNotificationRoute: boolean = true;
  isMessagesRoute = true;
  // @Input() title?: string = "";
  isListVisible: boolean = false;
  selectedSession: string = "";
  selectedIndex: number = 0;
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  appService = inject(AppService);
  sessionList: string[] = [];

  toggleSessionList(): void {
    this.isListVisible = !this.isListVisible;
  }

  selectSession(session: string, index: number, event: Event): void {
    event.stopPropagation();
    // this.appService.sessions.setValue(session);
    // Update the selected session and index
    this.selectedSession = session;
    this.selectedIndex = index;
    this.isListVisible = false; // Hide dropdown after selection
  }
  isFullscreen = false;
  fullscreenChangeHandler = this.onFullscreenChange.bind(this);

  constructor(private renderer: Renderer2) {}
  ngOnInit() {
    this.appService.getSchoolSessions();
    this.checkMessagesRoute();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.checkMessagesRoute();
      // this.checkNotificationRoute();
    });
    this.appService.sessions.subject.subscribe((sessions: any) => {
      this.sessionList = sessions.map((session: any) => session.name);
      if (this.sessionList.length > 0) {
        this.selectedSession = this.sessionList[0];
      } else {
        this.selectedSession = "No active session found.";
      }
      this.cdr.detectChanges();
    });
    document.addEventListener("fullscreenchange", this.fullscreenChangeHandler);
    this.applyAnimations();
    this.initializeDateTime();
    this.startTimeUpdate();
  }

  checkMessagesRoute() {
    this.isMessagesRoute = this.router.url === "/home/messages";
  }
  checkNotificationRoute() {
    this.isNotificationRoute = this.router.url === "/home/messages";
  }

  ngOnDestroy(): void {
    document.removeEventListener("fullscreenchange", this.fullscreenChangeHandler);
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  toggleFullscreen(): void {
    const docEl = document.documentElement;
    const mainWrapper = document.querySelector(".page-screen-isolated");

    if (!document.fullscreenElement) {
      docEl.requestFullscreen().then(() => {
        this.isFullscreen = true;
        this.cdr.detectChanges();
        if (mainWrapper) {
          this.renderer.addClass(mainWrapper, "full-screen-preview");
        }
      });
    } else {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
        this.cdr.detectChanges();
        if (mainWrapper) {
          this.renderer.removeClass(mainWrapper, "full-screen-preview");
        }
      });
    }
  }

  onFullscreenChange(): void {
    const mainWrapper = document.querySelector(".page-screen-isolated");
    if (!document.fullscreenElement && mainWrapper?.classList.contains("full-screen-preview")) {
      this.renderer.removeClass(mainWrapper, "full-screen-preview");
      this.isFullscreen = false;
      this.cdr.detectChanges();
    }
  }

  alerts = [
    {
      name: "Sayid Munoz",
      level: 2,
      class: "Dwer 12",
      image: "/images/sayid.png",
      icon: "/images/health-icon/vomiting-icon.svg",
      alt: "Vomiting health icon",
    },
    {
      name: "Rahman Munoz",
      level: 2,
      class: "Dwer 12",
      image: "/images/rahman.png",
      icon: "/images/health-icon/cough-icon.svg",
      alt: "Cough health icon",
    },
    {
      name: "Zahra Munoz",
      level: 2,
      class: "Dwer 12",
      image: "/images/zahra.png",
      icon: "/images/health-icon/fever-icon.svg",
      alt: "Fever health icon",
    },
    {
      name: "Ali Munoz",
      level: 2,
      class: "Dwer 12",
      image: "/images/ali.png",
      icon: "/images/health-icon/belly-pain-icon.svg",
      alt: "Belly pain health icon",
    },
    {
      name: "Fathima Munoz",
      level: 2,
      class: "Dwer 12",
      image: "/images/fathima.png",
      icon: "/images/health-icon/headache-icon.svg",
      alt: "Headache health icon",
    },
  ];

  @ViewChildren("alertItem")
  alertItems!: QueryList<ElementRef>;

  // ngAfterViewInit() {
  //   this.applyAnimations();
  // }

  applyAnimations() {
    if (!this.alertItems || !Array.isArray(this.alertItems)) return;

    const totalItems = this.alertItems.length;
    const animationDuration = 5;
    const totalDuration = totalItems * animationDuration;

    this.alertItems.forEach((item, index) => {
      const element = item.nativeElement;
      const delay = index * animationDuration;

      element.style.animation = `flipIn ${animationDuration}s ease-in-out ${delay}s infinite`;
      element.style.animationDuration = `${totalDuration}s`;

      const visiblePercentage = 100 / totalItems;
      element.style.animationDelay = `${delay}s`;
    });
  }
  gotoMessages() {
    this.isMessagesRoute = false;
    this.router.navigateByUrl("/home/messages");
  }

  currentTime: string = "";
  currentDate: string = "";
  currentTimezone: string = "";
  currentTimeArray: string[] = [];
  private timeInterval: any;

  private initializeDateTime(): void {
    this.updateDateTime();
  }

  private startTimeUpdate(): void {
    this.timeInterval = setInterval(() => {
      this.updateDateTime();
      this.cdr.detectChanges();
    }, 1000);
  }

  private updateDateTime(): void {
    const now = new Date();

    // Update time
    this.currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Convert time to array for individual digit animation
    this.currentTimeArray = this.currentTime.replace(/:/g, "").split("");

    // Update date
    this.currentDate = now.toDateString();

    // Update timezone
    this.currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}
