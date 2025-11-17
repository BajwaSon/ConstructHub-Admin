import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, RequestLoader } from "@jot143/core-angular";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AppService } from "../../app/services/app.service";
import { InputComponent } from "../../app/ngx-components/input/input.component";
import { InputDateComponent } from "../../app/ngx-components/input-date/input-date.component";
import { SubmitOnEnterDirective } from "../../app/shared/directives/submit-on-enter.directive";

// Calculate default session values based on current date
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1; // JS months are 0-based
let sessionStartYear: number, sessionEndYear: number;

if (currentMonth >= 8) {
  // August or later: session is currentYear-currentYear+1
  sessionStartYear = currentYear;
  sessionEndYear = currentYear + 1;
} else {
  // Before August: session is lastYear-currentYear
  sessionStartYear = currentYear - 1;
  sessionEndYear = currentYear;
}

const defaultSessionName = `${sessionStartYear}-${sessionEndYear}`;
const defaultStartDate = `${sessionStartYear}-08-01`;
const defaultEndDate = `${sessionEndYear}-07-31`;

@Component({
  selector: "app-session-modal",
  imports: [FormsModule, ReactiveFormsModule, InputComponent, InputDateComponent, SubmitOnEnterDirective],
  templateUrl: "./session-modal.component.html",
  styleUrl: "./session-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionModalComponent {
  private appService = inject(AppService);
  private alertService = inject(AlertService);
  public modalRef = inject(BsModalRef);

  @Output() sessionCreated = new EventEmitter<void>();

  loader = new RequestLoader();

  form = new FormGroup({
    name: new FormControl<string>(defaultSessionName, [Validators.required]),
    sessionStartDate: new FormControl<string>(defaultStartDate, [Validators.required]),
    sessionEndDate: new FormControl<string>(defaultEndDate, [Validators.required]),
    isActive: new FormControl<boolean>(true),
  });

  async createSession() {
    if (this.form.valid) {
      const sessionData = {
        name: this.form.value.name as string,
        sessionStartDate: this.form.value.sessionStartDate as string,
        sessionEndDate: this.form.value.sessionEndDate as string,
        isActive: this.form.value.isActive as boolean,
      };

      const apiCall = this.appService.createSession(sessionData, this.loader);
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall.response?.status === "OK") {
            this.alertService.success("Session created successfully!");
            this.sessionCreated.emit();
            this.modalRef.hide();
          } else {
            this.alertService.error(apiCall.response.message || "Failed to create session");
          }
        },
        error: (err: Error) => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });
    }
  }

  closeModal() {
    this.modalRef.hide();
  }
}
