/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, forwardRef } from "@angular/core";
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

import { BaseInputComponent } from "../baseInput.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-input-number",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./number.component.html",
  styleUrl: "./number.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
})
export class InputNumberComponent extends BaseInputComponent {
  @Input() override label: string = "";
  @Input() override formControl: FormControl = new FormControl("");
  @Input() options: { label: string; value: string }[] = [];
  @Input() max = Infinity;
  @Input() maxLength = Infinity;
  @Input() minLength = Infinity;
  @Input() min = -99999999999;
  @Input() allowDecimal = false;

  get pattern() {
    return this.allowDecimal ? "[0-9.]*" : "[0-9]*";
  }

  allowOnlyNumber(event: any) {
    // Allow backspace, delete, tab, escape, and enter keys
    if (event.key === "Backspace" || event.key === "Delete" || event.key === "Tab" || event.key === "Escape" || event.key === "Enter") {
      return;
    }

    // Allow Ctrl/Cmd+A (select all)
    if (event.key === "a" && (event.ctrlKey || event.metaKey)) {
      return;
    }

    // Allow Ctrl/Cmd+C (copy)
    if (event.key === "c" && (event.ctrlKey || event.metaKey)) {
      return;
    }

    // Allow Ctrl/Cmd+V (paste)
    if (event.key === "v" && (event.ctrlKey || event.metaKey)) {
      return;
    }

    // Allow Ctrl/Cmd+X (cut)
    if (event.key === "x" && (event.ctrlKey || event.metaKey)) {
      return;
    }

    // Allow decimal point if the flag is set
    if (this.allowDecimal && event.key === ".") {
      // Prevent multiple decimal points
      if (event.target.value.includes(".")) {
        event.preventDefault();
      }
      return;
    }

    // Check if the input value is a number (considering the decimal point if allowed)
    const inputValue = Number(event.target.value + event.key);
    if (!isNaN(inputValue) && inputValue > this.max) {
      event.preventDefault();
      return;
    }

    if (!isNaN(inputValue) && inputValue < this.min) {
      event.preventDefault();
      return;
    }

    if (event.key.match(/\d/)) {
      return;
    }

    // Prevent entering non-numeric characters
    if (event.keyCode < 48 || event.keyCode > 57) {
      event.preventDefault();
    }
  }
}
