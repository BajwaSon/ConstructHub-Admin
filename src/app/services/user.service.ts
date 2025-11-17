import { Injectable } from "@angular/core";
import { UserService as BaseUserService } from "@jot143/core-angular";

@Injectable({
  providedIn: "root",
})
export class UserService extends BaseUserService {
  override api = {
    forget: "auth.forgetPassword",
    setPassword: "auth.setPassword",
    setPermanentPassword: "auth.setPermanentPassword",
    me: "auth.me",
  };
}
