import { Injectable } from "@angular/core";
import { AuthService as BaseAuthService } from "@jot143/core-angular";

@Injectable({
  providedIn: "root",
})
export class AuthService extends BaseAuthService {
  override api = {
    login: "auth.login",
    forget: "auth.forgetPassword",
    reset: "auth.resetPassword",
    logout: "auth.logout",
    register: "auth.register",
    refresh: "auth.refresh",
    me: "auth.me",
  };
}
