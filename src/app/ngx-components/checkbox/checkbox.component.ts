import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputComponent } from "../baseInput.component";

@Component({
  selector: "app-checkbox",
  standalone: true,
  templateUrl: "./checkbox.component.html",
  styleUrl: "./checkbox.component.scss",
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent extends BaseInputComponent {
  @Input() override label: string = "";
  @Input() override formControl: FormControl = new FormControl("");
}
