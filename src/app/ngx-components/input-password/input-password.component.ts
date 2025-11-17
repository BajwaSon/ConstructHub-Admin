import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputComponent } from "../baseInput.component";

@Component({
  selector: "app-input-password",
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./input-password.component.html",
  styleUrl: "./input-password.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true,
    },
  ],
})
export class InputPasswordComponent extends BaseInputComponent {
  @Input() override label: string = "";
  @Input() override type: string = "password";
  @Input() override formControl: FormControl = new FormControl("");
  @Input() placeholder: string = "";
  @Input() id: string = "";
  @Input() autocomplete: string = "current-password";

  togglePasswordVisibility() {
    this.type = this.type === "password" ? "text" : "password";
  }
}
