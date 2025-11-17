/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, Input } from "@angular/core";
import { AvatarService } from "../../../app/services/avatar.service";

@Component({
  selector: "app-student-card",
  templateUrl: "./student-card.component.html",
  styleUrls: ["./student-card.component.scss", "../../home-index/pages/department/department.component.scss"],
})
export class StudentCardComponent {
  @Input() student: any = null;
  @Input() title: string = "Overall stats about";

  avatarService = inject(AvatarService);

  getClassNames(): string {
    if (!this.student?.classes?.length) return "";
    return this.student.classes.map((c: any) => c.classSectionName).join(", ");
  }
}
