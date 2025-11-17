/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BaseInputComponent } from "../baseInput.component";
import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-input-date",
  templateUrl: "./input-date.component.html",
  styleUrls: ["./input-date.component.scss"],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
  ],
})
export class InputDateComponent implements ControlValueAccessor {
  @Input() label: string = "";
  @Input() formControl: FormControl = new FormControl("");
  @Input() readonly: boolean = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

// @Component({
//   selector: "app-input-date",
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: "./input-date.component.html",
//   styleUrl: "./input-date.component.scss",
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => InputDateComponent),
//       multi: true,
//     },
//   ],
// })
// export class InputDateComponent extends BaseInputComponent {
//   @Input() override label: string = "";
//   @Input() override formControl: FormControl = new FormControl("");
// }
