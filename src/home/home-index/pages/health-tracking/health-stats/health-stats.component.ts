/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { coreSignal, RequestLoader } from "@jot143/core-angular";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { Child } from "../../../../../app/model/Child";
import { AvatarService } from "../../../../../app/services/avatar.service";
import { ConfigureChildrenService } from "../../../../../app/services/child/configure-children.service";
import { HealthService } from "../../../../../app/services/child/health.service";
import { ClassByLevelSchedulingService } from "../../../../../app/services/class-by-level-scheduling.service";
import { ClassSectionService } from "../../../../../app/services/class-section.service";
import { CreateSectionService } from "../../../../../app/services/create-section.service";
import { SingleSelectComponent } from "../../../../components/single-select/single-select.component";
import { LoaderComponent } from "../../loader/loader.component";
@Component({
  selector: "app-health-stats",
  imports: [CommonModule, FormsModule, SingleSelectComponent, ReactiveFormsModule, LoaderComponent],
  providers: [BsModalService],
  templateUrl: "./health-stats.component.html",
  styleUrl: "./health-stats.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthStatsComponent implements OnInit {
  modalService = inject(BsModalService);
  createSectionService = inject(CreateSectionService);
  classLevelService = inject(ClassByLevelSchedulingService);
  classSectionService = inject(ClassSectionService);
  healthService = inject(HealthService);
  avatarService = inject(AvatarService);
  cdr = inject(ChangeDetectorRef);
  openedModal!: BsModalRef;
  destroy$ = new Subject<void>();
  isSearchVisible = false;
  closeModal() {
    this.openedModal.hide();
  }

  openModal(modalDiv: any) {
    this.openedModal = this.modalService.show(modalDiv, { class: "modal-dialog modal-dialog-centered" });
  }

  levelList = computed(() => [
    {
      label: "Select Level",
      value: "",
    },
    ...this.classLevelService.classLevels().map(level => ({
      label: level.levelName,
      value: level.id,
    })),
  ]);

  classNameList = computed(() => [
    {
      label: "Select Class",
      value: "",
    },
    ...this.classSectionService.classSectionsByClassLevel().map(section => ({
      label: section.classSectionName,
      value: section.id,
    })),
  ]);
  healthStatsForm = new FormGroup({
    classLevel: new FormControl("", Validators.required),
    className: new FormControl("", Validators.required),
  });

  studentHealthStats = [
    {
      title: "Heart Rate",
      value: () => this.getLatestValue(this.healthService.heartRate()),
      unit: "Bpm",
      icon: "/images/health-icon/heart-rate.svg",
      bgColor: "var(--light-red-bg)",
      bdColor: "var(--light-red-border)",
    },
    {
      title: "Body Temperature",
      value: () => this.getLatestValue(this.healthService.bodyTemperature()),
      unit: "°C",
      icon: "/images/health-icon/body-temperature.svg",
      bgColor: "var(--light-blue-bg)",
      bdColor: "var(--light-blue-border)",
    },
    {
      title: "BP",
      value: () => this.getLatestValue(this.healthService.bloodPressure()),
      unit: "Bpm",
      icon: "/images/health-icon/bp.svg",
      bgColor: "var(--light-green-bg)",
      bdColor: "var(--light-green-border)",
    },
    {
      title: "HRV",
      value: () => this.getLatestValue(this.healthService.hrv()),
      unit: "ms",
      icon: "/images/health-icon/hrv.svg",
      bgColor: "var(--light-orange-bg)",
      bdColor: "var(--light-orange-border)",
    },
    {
      title: "SPO2",
      value: () => this.getLatestValue(this.healthService.spo2()),
      unit: "%",
      icon: "/images/health-icon/spo2.svg",
      bgColor: "var(--light-yellow-bg)",
      bdColor: "var(--light-yellow-border)",
    },
    {
      title: "Stress Value",
      value: () => this.getLatestValue(this.healthService.stressValue()),
      unit: "psi",
      icon: "/images/health-icon/stress-value.svg",
      bgColor: "var(--light-pink-bg)",
      bdColor: "var(--light-pink-border)",
    },
    {
      title: "Breathing Rate",
      value: () => this.getLatestValue(this.healthService.breathingRate()),
      unit: "pm",
      icon: "/images/health-icon/breathing-rate.svg",
      bgColor: "var(--light-sky-bg)",
      bdColor: "var(--light-sky-border)",
    },
    {
      title: "Calories",
      value: () => this.getLatestValue(this.healthService.calories()),
      unit: "kcal",
      icon: "/images/health-icon/calories.svg",
      bgColor: "var(--light-shade-bg)",
      bdColor: "var(--light-shade-border)",
    },
    // {
    //   title: "Sleep",
    //   value: () => this.getLatestValue(this.healthService.sleepHours()),
    //   unit: "h",
    //   icon: "/images/health-icon/sleep.svg",
    //   bgColor: "var(--light-darkblue-bg)",
    //   bdColor: "var(--light-darkblue-border)",
    // },
  ];

  getLatestValue(serviceArray: any) {
    if (serviceArray.length > 0) {
      return parseFloat(serviceArray[serviceArray.length - 1].value.toFixed(2));
    }
    return 0;
  }
  activeStudent: any = [];
  configureChildrenService = inject(ConfigureChildrenService);
  cd = inject(ChangeDetectorRef);
  previousSelectedChildIndex = coreSignal<number | null>(null);
  childSignal = coreSignal<Child | null>(null);
  get child() {
    return this.childSignal();
  }

  classLevelLoader = new RequestLoader();
  classSectionLoader = new RequestLoader();
  ngOnInit(): void {
    this.getAllClassSections();
    // this.createSectionService.getChilds();
    this.classLevelService.getAllClassLevels();
    this.classLevelService.classLevels.subject.subscribe({
      next: () => {
        const firstLevel = this.levelList()?.[0]?.value;
        if (firstLevel) {
          this.onLevelChange(firstLevel, "level");
        }
      },
    });
    this.classSectionService.classSections.subject.subscribe({
      next: () => {
        const firstLevel = this.classNameList()?.[0]?.value;
        if (firstLevel) {
          this.onLevelChange(firstLevel, "className");
        }
      },
    });
    this.classSectionService.classSectionById.subject.subscribe({
      next: () => {
        const firstClass = this.classSectionService.classSectionById()?.[0];
        if (firstClass) {
          this.setActiveStudent(firstClass);
        }
      },
    });

    // this.configureChildrenService.selectedChild.pipe(takeUntil(this.destroy$)).subscribe((child: Child | null) => {
    //   if (child && child.serverSetup?.value) this.healthService.getHealthDetail(child);
    //   else if (child && child.serverSetup.subscribe) {
    //     child.serverSetup.subscribe(setup => {
    //       if (setup) this.healthService.getHealthDetail(child);
    //     });
    //   }
    // });
  }
  setActiveStudent(student: any) {
    if (student) {
      if (this.activeStudent === student) {
        this.healthService.getHealthDetail(student);
        this.activeStudent = null;
      } else {
        this.activeStudent = student;
        this.healthService.getHealthDetail(student);
      }
    }
  }
  selectChild(child: Child) {
    this.configureChildrenService.selectedChildId.setValue(child.id as number);
  }
  getAllClassSections() {
    this.classSectionService.getAllClassSections().subject.subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        console.error(err.message);
      },
    });
  }
  onLevelChange(selectedLevel: any, type?: string) {
    const value = typeof selectedLevel === "object" ? selectedLevel.value : selectedLevel;

    if (type === "level") {
      // this.classLevelId.setValue(value);

      this.healthStatsForm.patchValue({ classLevel: value });
      if (this.healthStatsForm.value.classLevel === "") {
        this.healthStatsForm.patchValue({ className: "" });
      }
      const apiCall = this.classSectionService.getByClassLevel(value);
      if (apiCall?.subject) {
        apiCall.subject.subscribe({
          next: response => {
            if (!response?.data?.length) {
              this.healthStatsForm.patchValue({ className: "" });
              // this.classSectionId.setValue(this.healthStatsForm.value.className || "");
              // this.configureSectionService.selectedChildren.next(null);
            }
          },
        });
      }
    }

    if (type === "className") {
      this.healthStatsForm.patchValue({ className: value });
      if (value) {
        // this.classSectionId.setValue(value);
        this.classSectionService.getByClassSectionId(value);
      } else {
        // this.classLevelId.setValue(this.healthStatsForm.value.classLevel || "");
        // this.classSectionId.setValue("");
        this.healthStatsForm.patchValue({ className: "" });
        // this.configureSectionService.selectedChildren.next(null);
      }
    }
  }

  // Toggle View
  isGridView = false;

  toggleView(isGrid: boolean): void {
    this.isGridView = isGrid;
  }
}
