/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, forwardRef } from "@angular/core";
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";

@Component({
  selector: "app-base-input",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div>
      <label for="">{{ label }}</label>
      <input [type]="type" [formControl]="formControl" (input)="onInput($event)" />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseInputComponent),
      multi: true,
    },
  ],
})
export class BaseInputComponent {
  @Input() label: string = "";
  @Input() type: string = "text";
  @Input() readonly: boolean = false;

  @Input() formControl: FormControl = new FormControl("");

  private _value: string = "";

  onInput($event: any) {
    this._value = $event.target.value;
    this.onChange(this._value);
    this.onTouched();
  }

  onChange = (value: any) => {};

  onTouched = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this._value = value;
      // this.formControl.setValue(this._value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // setDisabledState(isDisabled: boolean): void {
  //   if (isDisabled) {
  //     this.formControl.disable();
  //   } else {
  //     this.formControl.enable();
  //   }
  // }
}
