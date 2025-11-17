import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { BaseComponent, coreSignal } from "@jot143/core-angular";

import { Child } from "../../../../app/model/Child";
import { AttendanceService } from "../../../../app/services/child/attendance.service";
import { ConfigureChildrenService } from "../../../../app/services/child/configure-children.service";
import { AttendanceGraphCardComponent } from "./attendance-graph-card/attendance-graph-card.component";

@Component({
  selector: "app-attendance",
  imports: [FormsModule, AttendanceGraphCardComponent],
  templateUrl: "./attendance.component.html",
  styleUrl: "./attendance.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceComponent extends BaseComponent {
  // export class AttendanceComponent extends BaseComponent implements OnInit {
  override title: string = "Attendance Component";
  @Input() child: Child = new Child();
  @Input() classLevelId = coreSignal<string | number>("");
  @Input() classSectionId = coreSignal<string | number>("");
  // private modalCtrl = inject(ModalController);
  private attendanceService = inject(AttendanceService);
  private configureChildrenService = inject(ConfigureChildrenService);

  // ngOnInit() {
  // this.configureChildrenService.selectedChild.pipe(takeUntil(this.destroy$))
  // .subscribe((child: Child | null) => {
  // if (child && child.serverSetup?.value) this.attendanceService.getAttendanceDetail(child);
  // else if (child && child.serverSetup.subscribe) {
  //   child.serverSetup.subscribe(setup => {
  //     if (setup) this.attendanceService.getAttendanceDetail(child);
  //   });
  // }
  // });
  // }

  // onSubjectChange(event: any) {
  //   // this.attendanceService.selectedSubject.setValue(event);
  // }

  openFullView() {
    // this.modalCtrl
    //   .create({
    //     component: AttendanceDetailComponent,
    //   })
    //   .then(m => m.present());
  }

  openAddAttendance() {
    // this.modalCtrl
    //   .create({
    //     component: AddAttendanceComponent,
    //   })
    //   .then(m => m.present());
  }
}
