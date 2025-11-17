import { Component, Input, forwardRef } from "@angular/core";
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

import { BaseInputComponent } from "../../baseInput.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-weight",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./weight.component.html",
  styleUrl: "./weight.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WeightComponent),
      multi: true,
    },
  ],
})
export class WeightComponent extends BaseInputComponent {
  @Input() label: string = "Weight";
  @Input() weight: FormControl = new FormControl("");
  @Input() weightUnit: FormControl = new FormControl("");

  allowOnlyNumber(event) {
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

    if (event.key.match(/\d/)) {
      return;
    }

    // Prevent entering non-numeric characters
    if (event.keyCode < 48 || event.keyCode > 57) {
      event.preventDefault();
    }
  }
}
