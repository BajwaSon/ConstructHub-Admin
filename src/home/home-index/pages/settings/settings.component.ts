/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, passwordMatchValidator, RequestLoader, RippleButtonDirective } from "@jot143/core-angular";
import { ReverseTimer } from "@jot143/core-js";
import { BsModalRef, BsModalService, ModalModule } from "ngx-bootstrap/modal";
import { InputPasswordComponent } from "../../../../app/ngx-components/input-password/input-password.component";
import { InputComponent } from "../../../../app/ngx-components/input/input.component";
import { AppService } from "../../../../app/services/app.service";
import { AvatarService } from "../../../../app/services/avatar.service";
import { SettingService } from "../../../../app/services/setting.service";
import { StateService } from "../../../../app/services/state.service";
import { UserService } from "../../../../app/services/user.service";
import { AuthService } from "../../../../auth/auth.service";
import { SubmitOnEnterDirective } from "../../../../app/shared/directives/submit-on-enter.directive";
import { InputNumberComponent } from "../../../../app/ngx-components/number/number.component";

@Component({
  selector: "app-settings",
  imports: [
    CommonModule,
    InputPasswordComponent,
    InputComponent,
    ModalModule,
    RippleButtonDirective,
    ReactiveFormsModule,
    FormsModule,
    SubmitOnEnterDirective,
    InputNumberComponent,
  ],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
})
export class SettingsComponent implements OnInit {
  @ViewChild("closeChangePasswordCanvas") closeChangePasswordCanvas!: ElementRef;
  @ViewChild("openChangeOTPCanvas") openChangeOTPCanvas!: ElementRef;
  public appService = inject(AppService);
  public alertService = inject(AlertService);
  public settingService = inject(SettingService);
  public stateService = inject(StateService);
  public userService = inject(UserService);
  public authService = inject(AuthService);

  avatarService = inject(AvatarService);
  openedModal!: BsModalRef;
  isSearchVisible = false;
  isPushNotificationsEnabled = true;
  reverseTimer = new ReverseTimer("settings");
  otp: string[] = ["", "", "", ""];
  loader = new RequestLoader();
  sendAgainLoader = new RequestLoader();

  passwordForm = new FormGroup(
    {
      oldPassword: new FormControl<string>("", [Validators.required]),
      password: new FormControl<string>("", [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl<string>("", [Validators.required, Validators.minLength(6)]),
    },
    {
      validators: passwordMatchValidator("password", "passwordConfirm"),
    }
  );

  emailForm = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email]),
  });

  form = new FormGroup({
    otp: new FormControl<string>("", [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
  });

  ngOnInit(): void {
    this.userService.me();
    this.reverseTimer.start(60);
  }

  isOtpComplete(): boolean {
    const otp = this.form.value.otp ?? "";
    return otp.length === 4;
  }

  async resendOTPCode() {
    if (this.reverseTimer.isRunning()) {
      const { email } = this.emailForm.value;
      const role = this.stateService.user.role.name.toLowerCase();
      const payload: any = { email: email, role: role };
      const apiCall = this.settingService.updateEmailSendOtp(payload, this.sendAgainLoader);
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response.status == "OK") {
            this.clearOtpFields();
            this.reverseTimer.start(60);
            return this.alertService.success(apiCall.response.message);
          }
          this.alertService.error(apiCall.response.message || "Something went wrong");
        },
        error: async (err: Error) => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });
    }
  }

  get isPasswordValid(): boolean {
    return this.passwordRequirements.every(requirement => requirement.isValid);
  }

  resetEmailForm() {
    this.emailForm = new FormGroup({
      email: new FormControl<string>("", [Validators.required, Validators.email]),
    });
  }

  resetOtpForm() {
    this.form = new FormGroup({
      otp: new FormControl<string>("", [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    });
  }

  clearOtpFields() {
    for (let i = 0; i <= 3; i++) {
      const inputElement = document.getElementById(`otp-input-${i}`) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = "";
      }
    }
  }

  changePassword() {
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid) return;
    if (this.passwordForm.valid) {
      const { oldPassword, password } = this.passwordForm.value;
      const role = this.stateService.user.role.name.toLowerCase();
      const payload: any = {
        currentPassword: oldPassword,
        newPassword: password,
        role: role,
      };

      const apiCall = this.settingService.updatePassword(payload, this.loader);
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall?.response && apiCall?.response?.status == "OK") {
            this.alertService.success(apiCall.response.message);
            this.closeChangePasswordCanvas.nativeElement.click();
            this.authService.logout();
          } else {
            return this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: (err: Error) => {
          this.alertService.error(err.message || "Something went wrong. Please try again.");
        },
      });
    }
  }

  get passwordRequirements(): { text: string; isValid: boolean }[] {
    const password = this.passwordForm.value.password || "";
    return [
      {
        text: "At least 8 characters long",
        isValid: password.length >= 8,
      },
      {
        text: "At least one uppercase letter",
        isValid: /[A-Z]/.test(password),
      },
      {
        text: "At least one lowercase letter",
        isValid: /[a-z]/.test(password),
      },
      {
        text: "At least one number",
        isValid: /[0-9]/.test(password),
      },
      {
        text: "At least one special character (@$!%*?&)",
        isValid: /[@$!%*?&]/.test(password),
      },
    ];
  }

  onTogglePushNotifications(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isPushNotificationsEnabled = isChecked;
    const payload = {
      pushNotifications: isChecked ? 1 : 0,
    };
    const apiCall = this.settingService.updatePushNotifications(payload, this.loader);
    apiCall.subject.subscribe({
      next: () => {
        if (apiCall?.response && apiCall?.response?.status === "OK") {
          this.alertService.success(apiCall.response.message);
          this.userService.me();
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: (err: Error) => {
        this.alertService.error(err.message || "Something went wrong. Please try again.");
      },
    });
  }

  requestOtp() {
    const { email } = this.emailForm.value;
    const role = this.stateService.user.role.name.toLowerCase();
    const payload: any = { email: email, role: role };
    const apiCall = this.settingService.updateEmailSendOtp(payload, this.loader);
    apiCall.subject.subscribe({
      next: (res: any) => {
        if (apiCall.response?.status == "OK") {
          document.getElementById("openChangeEmailOTPCanvas")?.click();
          // this.router.navigateForward(`/home/setting`);
          this.alertService.success(apiCall.response.message);
          this.resetOtpForm();
          this.reverseTimer.start(60);
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: (err: Error) => {
        this.alertService.error(err.message || "Something went wrong. Please try again.");
      },
    });
  }

  submit() {
    if (this.form.valid) {
      const { email } = this.emailForm.value;

      const apiCall = this.settingService.updateEmailVerifyStore(
        {
          email: email?.toString(),
          otp: this.form.value.otp as string,
          role: this.stateService.user.role.name.toLowerCase(),
        },
        this.loader
      );
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status == "OK") {
            this.openChangeOTPCanvas.nativeElement.click();
            this.alertService.success(apiCall.response.message);
            this.userService.me();

            setTimeout(() => {
              this.closeModal();
            }, 1000);
          }
          this.alertService.error(apiCall.response.message || "Something went wrong");
        },
        error: async (err: Error) => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });
    }
  }

  onInput(event: any, index: number) {
    const value = event.target.value;

    if (value.length === 1 && index < 3) {
      (document.getElementById(`otp-input-${index + 1}`) as HTMLElement).focus();
    }

    this.otp[index] = String(value);
  }

  onBackspace(event: KeyboardEvent, index: number) {
    if (event.key === "Backspace") {
      if (this.otp[index] === "") {
        event.preventDefault();
        if (index > 0) {
          (document.getElementById(`otp-input-${index - 1}`) as HTMLElement).focus();
        }
      }
    } else {
      this.onInput(event, index);
    }
  }

  closeModal() {
    this.openedModal.hide();
  }

  resetPasswordForm() {
    this.passwordForm = new FormGroup(
      {
        oldPassword: new FormControl<string>("", [Validators.required]),
        password: new FormControl<string>("", [Validators.required, Validators.minLength(6)]),
        passwordConfirm: new FormControl<string>("", [Validators.required, Validators.minLength(6)]),
      },
      {
        validators: passwordMatchValidator("password", "passwordConfirm"),
      }
    );
  }
}
