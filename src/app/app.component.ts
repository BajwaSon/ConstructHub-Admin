import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { ApiService, AUTH_HOOK, AuthService, CoreRouterOutletComponent, HookService, indexedDbService, LoaderService, NavigationService, UserService } from "@jot143/core-angular";
import { BaseComponent } from "./common/base.component";
import { AppService } from "./services/app.service";

@Component({ selector: "app-root", templateUrl: "./app.component.html", styleUrls: ["./app.component.scss"], imports: [CoreRouterOutletComponent] })
export class AppComponent extends BaseComponent implements OnInit {
  override title: string = "School Admin Panel";

  private loaderService = inject(LoaderService);
  private apiService = inject(ApiService);
  private hookService = inject(HookService);
  private cd = inject(ChangeDetectorRef);
  private navigationService = inject(NavigationService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private appService = inject(AppService);
  loading$ = this.loaderService.loading$;

  constructor() {
    super();
    this.apiService.init();
  }

  ngOnInit() {
    this.subscribeToLogin();
    this.subscribeToLogout();

    this.loadCurrentUser();
  }

  loadCurrentUser() {
    if (this.authService.isLoggedIn()) {
      this.userService.me();
      this.appService.getSchoolSessions();
    }
  }

  subscribeToLogin() {
    this.hookService.addAction(AUTH_HOOK.ON_LOGIN_SUCCESS).subscribe({
      next: () => {
        this.loadCurrentUser();
        this.cd.detectChanges();
      },
    });
  }

  subscribeToLogout() {
    this.hookService.addAction(AUTH_HOOK.ON_LOGOUT).subscribe(() => {
      this.navigationService.navigateRoot("/auth/login");
      indexedDbService.clearTable("pre-loaded");
      this.cd.detectChanges();
    });
  }
}
