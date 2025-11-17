import { CanActivate, UrlTree } from "@angular/router";
import { inject, Injectable } from "@angular/core";
import { NavigationService } from "@jot143/core-angular";
import { Observable, switchMap, take, map } from "rxjs";
import { AppService } from "../services/app.service";

@Injectable({
  providedIn: "root",
})
export class SetupReverseGuard implements CanActivate {
  private router = inject(NavigationService);
  private appService = inject(AppService);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Always fetch sessions to ensure latest state
    return this.appService.getSchoolSessions().subject.pipe(
      take(1),
      switchMap(() => this.appService.sessions.subject.pipe(take(1))),
      map(sessions => {
        const isInitialSetup = sessions && sessions.length > 0;
        if (isInitialSetup) {
          this.router.navigateRoot("/home");
          return false;
        }
        return true;
      })
    );
  }
}
