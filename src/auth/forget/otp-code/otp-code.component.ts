import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { PageComponent } from "../../../app/common/page.component";
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertService, NavigationService, passwordMatchValidator, RequestLoader, UserService } from "@jot143/core-angular";
import { ReverseTimer } from "@jot143/core-js";
import { ActivatedRoute } from "@angular/router";
import * as Case from "case";
import { InputPasswordComponent } from "../../../app/ngx-components/input-password/input-password.component";
import { InputNumberComponent } from "../../../app/ngx-components/number/number.component";
import { SubmitOnEnterDirective } from "../../../app/shared/directives/submit-on-enter.directive";

@Component({
  selector: "app-otp-code",
  imports: [FormsModule, ReactiveFormsModule, InputNumberComponent, InputPasswordComponent, SubmitOnEnterDirective],
  templateUrl: "./otp-code.component.html",
  styleUrl: "../../auth.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpCodeComponent extends PageComponent implements OnInit {
  override title = "Forget Password - OTP code";

  //inject dependency
  userService = inject(UserService);
  alertService = inject(AlertService);
  router = inject(NavigationService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  form = new FormGroup(
    {
      email: new FormControl<string>("", [Validators.required, Validators.email]),
      otp: new FormControl<string>("", [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
      password: new FormControl<string>("", [Validators.required]),
      passwordConfirm: new FormControl<string>("", [Validators.required]),
    },
    { validators: passwordMatchValidator("password", "passwordConfirm") }
  );

  formForgetPassword = new FormGroup({ email: new FormControl<string>("", [Validators.required, Validators.email]) });

  reverseTimer = new ReverseTimer(Case.snake(this.title));
  loader = new RequestLoader();
  sendAgainLoader = new RequestLoader();

  ngOnInit() {
    // Access the 'email' query parameter from the URL
    this.activatedRoute.queryParams.subscribe(params => {
      const email = params["email"];
      this.formForgetPassword.patchValue({ email });
      this.form.patchValue({ email });
      if (this.formForgetPassword.invalid) {
        this.alertService.error("Something went wrong");
        this.router.navigateBack();
      }
    });
    this.reverseTimer.start(60);
  }
  get passwordRequirements(): { text: string; isValid: boolean }[] {
    const password = this.form.controls.password.value || "";
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
  get isPasswordValid(): boolean {
    return this.passwordRequirements.every(requirement => requirement.isValid);
  }
  resendOTPCode() {
    // this.reverseTimer.start(60);
    if (this.reverseTimer.isRunning()) {
      // if (this.formForgetPassword.invalid) {
      //   return;
      // }
      const apiCall = this.userService.forget({ username: this.formForgetPassword.value.email as string }, this.sendAgainLoader);
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response.status == "OK") {
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

  resetPassword() {
    if (this.form.invalid) {
      return;
    }
    const apiCall = this.userService.setPassword(
      { username: this.form.value.email as string, token: this.form.value.otp as string, password: this.form.value.password as string },
      this.loader
    );
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status == "OK") {
          this.router.navigateForward(`/auth/forgot-password/forget-success`);
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
