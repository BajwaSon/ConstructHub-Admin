import { inject, Injectable } from "@angular/core";
import { AlertService } from "@jot143/core-angular";
import { ToastrService as NgxToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ToastrService extends AlertService {
  toastr = inject(NgxToastrService);

  override success(message: string) {
    this.toastr.success(message);
  }

  override error(message: string) {
    this.toastr.error(message);
  }

  override warn(message: string) {
    this.toastr.warning(message);
  }

  override info(message: string) {
    this.toastr.info(message);
  }
}
