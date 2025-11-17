import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, passwordMatchValidator, RequestLoader, User, UserService } from "@jot143/core-angular";
import { PageComponent } from "../../app/common/page.component";
import { InputPasswordComponent } from "../../app/ngx-components/input-password/input-password.component";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-set-password",
  imports: [FormsModule, ReactiveFormsModule, InputPasswordComponent],
  templateUrl: "./set-password.component.html",
  styleUrl: "./set-password.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPasswordComponent extends PageComponent implements OnInit {
  override title = "Set Password";

  //inject dependency
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  form = new FormGroup(
    {
      username: new FormControl<string>(""),
      password: new FormControl<string>(""),
      passwordConfirm: new FormControl<string>("", [Validators.required]),
    },
    {
      validators: passwordMatchValidator("password", "passwordConfirm"),
    }
  );

  loader = new RequestLoader();

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
    return this.passwordRequirements.every(req => req.isValid);
  }

  ngOnInit() {
    const user: User | null = this.userService.currentUser();
    if (user) {
      this.form.controls.username.setValue(user.username);
    }

    this.userService.currentUser.subject.subscribe(user => {
      if (user) {
        this.form.controls.username.setValue(user.username);
      }
    });
  }

  updatePassword() {
    if (this.form.invalid || !this.isPasswordValid) {
      return;
    }
    const apiCall = this.userService.setPermanentPassword({ password: this.form.value.password as string }, this.loader);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status == "OK") {
          this.authService.logout();
          return this.alertService.success(apiCall.response.message);
        }

        this.alertService.error(apiCall.response.message || "Something went wrong");
      },

      error: async (err: Error) => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
