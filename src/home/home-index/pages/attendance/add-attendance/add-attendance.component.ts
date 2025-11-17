import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-add-attendance",
  imports: [],
  templateUrl: "./add-attendance.component.html",
  styleUrl: "./add-attendance.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAttendanceComponent implements OnInit {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  @Input() title = "";
  @Input() showNotification = true;

  // modalCtrl = inject(ModalController);

  async openNotifications() {
    // const { NotificationsComponent } = await import("src/home/pages/notifications/notifications.component");
    // this.modalCtrl
    //   .create({
    //     component: NotificationsComponent,
    //   })
    //   .then(modal => modal.present());
  }
}
