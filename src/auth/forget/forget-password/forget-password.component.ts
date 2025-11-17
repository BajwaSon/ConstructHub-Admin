import { NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, NavigationService, RequestLoader, UserService } from "@jot143/core-angular";
import { PageComponent } from "../../../app/common/page.component";
import { InputComponent } from "../../../app/ngx-components/input/input.component";
import { SubmitOnEnterDirective } from "../../../app/shared/directives/submit-on-enter.directive";

@Component({
  selector: "app-forget-password",
  imports: [NgOptimizedImage, FormsModule, ReactiveFormsModule, InputComponent, SubmitOnEnterDirective],
  templateUrl: "./forget-password.component.html",
  styleUrl: "../../auth.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPasswordComponent extends PageComponent {
  override title = "Forget Password";

  // inject dependencies
  userService = inject(UserService);
  alertService = inject(AlertService);
  private router = inject(NavigationService);

  form = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
  });

  loader = new RequestLoader();

  requestOnForgetPassword() {
    if (this.form.invalid) {
      return;
    }
    const apiCall = this.userService.forget({ username: this.form.value.email as string }, this.loader);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response.status == "OK") {
          this.router.navigateForward(`/auth/forgot-password/otp-code`, { queryParams: { email: this.form.value.email } });
          return this.alertService.success(apiCall.response.message);
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },

      error: async (err: Error) => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });
  }

  gotoLogin() {
    this.router.navigateBackward("/auth/login");
  }
}
