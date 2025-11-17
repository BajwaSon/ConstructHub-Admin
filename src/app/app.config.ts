import { ApplicationConfig, importProvidersFrom, isDevMode } from "@angular/core";
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from "@angular/router";

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideServiceWorker, ServiceWorkerModule } from "@angular/service-worker";
import {
  AlertService,
  ApiService,
  AuthInterceptor,
  AuthService as BaseAuthService,
  StateService as BaseStateService,
  UserService as BaseUserService,
  CORE_ANGULAR_CONFIG,
  CoreAngularConfig,
  NavigationService,
} from "@jot143/core-angular";
import { ToastrModule } from "ngx-toastr";
import * as defaultApiResponse from "../../dump/default-routes.json";
import { AuthService } from "../auth/auth.service";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";
import { ToastrService } from "./common/ui/toastr.service";
import { StateService } from "./services/state.service";
import { UserService } from "./services/user.service";
import { AppService } from "./services/app.service";

const coreAngularConfig: CoreAngularConfig = {
  cacheTimeLimit: 10,
  debugMode: environment.debugMode,
  backends: { default: { baseUrl: environment.baseUrl, routesUrl: environment.routesUrl, routes: defaultApiResponse } },
};

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules), // withDebugTracing(),
      withInMemoryScrolling({ anchorScrolling: "enabled", scrollPositionRestoration: "enabled" })
    ),
    // provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(
      ToastrModule.forRoot({
        // timeOut: 10000,
        positionClass: "toast-top-right",
        preventDuplicates: true,
      })
    ),
    importProvidersFrom(
      ServiceWorkerModule.register("ngsw-worker.js", {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: "registerWhenStable:30000",
      })
    ),
    //Core Angular
    { provide: CORE_ANGULAR_CONFIG, useValue: coreAngularConfig },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Ensures this interceptor is used along with others if needed
    },
    // { provide: RouteReuseStrategy, useClass: PreloadAllModules },
    { provide: BaseStateService, useClass: StateService },
    { provide: BaseAuthService, useClass: AuthService },
    { provide: BaseStateService, useClass: StateService },
    { provide: AlertService, useClass: ToastrService },
    { provide: NavigationService, useClass: NavigationService },
    { provide: BaseUserService, useClass: UserService },
    AppService,
    ApiService,

    provideServiceWorker("ngsw-worker.js", { enabled: !isDevMode(), registrationStrategy: "registerWhenStable:30000" }),
  ],
};
