import { NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, AUTH_HOOK, AuthService, HookService, NavigationService, RequestLoader } from "@jot143/core-angular";
import { BsModalService } from "ngx-bootstrap/modal";
import { takeUntil } from "rxjs";
import { PageComponent } from "../../app/common/page.component";
import { InputPasswordComponent } from "../../app/ngx-components/input-password/input-password.component";
import { InputComponent } from "../../app/ngx-components/input/input.component";
import { SubmitOnEnterDirective } from "../../app/shared/directives/submit-on-enter.directive";
// import { SessionModalComponent } from "../session-modal/session-modal.component";
import { AppService } from "../../app/services/app.service";

@Component({
  selector: "app-login",
  imports: [FormsModule, ReactiveFormsModule, NgOptimizedImage, InputComponent, InputPasswordComponent, SubmitOnEnterDirective],
  templateUrl: "./login.component.html",
  styleUrl: "../auth.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends PageComponent implements OnInit {
  override title = "Login Page";

  // inject dependencies
  private hookService: HookService = inject(HookService);
  private router = inject(NavigationService);
  private alertService = inject(AlertService);
  private appService = inject(AppService);
  private cd = inject(ChangeDetectorRef);
  private modalService = inject(BsModalService);

  private authService = inject(AuthService);
  loader = new RequestLoader();

  form = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
    password: new FormControl<string>("", [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit(): void {
    this.hookService
      .addAction(AUTH_HOOK.ON_LOGIN_SUCCESS, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.onLoginSuccess();
        },
      });
  }

  onLoginSuccess = () => {
    const apiCall = this.appService.getSchoolSessions();
    apiCall.subject.subscribe({
      next: () => {
        const sessions = this.appService.sessions();
        if (sessions && sessions.length > 0) {
          this.router.navigateRoot("/home/dashboard");
          // this.cd.detectChanges();
        } else {
          this.router.navigateRoot("/school-registration");
        }
      },
    });
  };

  // showSessionModal() {
  //   const modalRef = this.modalService.show(SessionModalComponent, {
  //     class: "modal-dialog-centered modal-lg",
  //     backdrop: "static",
  //     keyboard: false,
  //   });

  //   // Subscribe to modal hidden event to navigate to dashboard
  //   if (modalRef.onHidden) {
  //     modalRef.onHidden.subscribe(() => {
  //       this.router.navigateRoot("/home/dashboard");
  //       this.appService.getSchoolSessions();
  //       this.cd.detectChanges();
  //     });
  //   }

  //   // Subscribe to session created event
  //   if (modalRef.content) {
  //     modalRef.content.sessionCreated.subscribe(() => {
  //       // Session was created successfully, navigation will happen on modal close
  //     });
  //   }
  // }

  async login() {
    if (this.form.valid) {
      const apiCall = await this.authService.login({ username: this.form.value.email as string, password: this.form.value.password as string }, this.loader);
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status === "FAILED") {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: (err: Error) => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });
    }
  }

  gotoForgetPassword() {
    this.router.navigateForward("/auth/forgot-password");
  }
}
