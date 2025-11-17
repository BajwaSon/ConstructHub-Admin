import { Component, Input, forwardRef } from "@angular/core";
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { BaseInputComponent } from "../baseInput.component";

@Component({
  selector: "app-input",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./input.component.html",
  styleUrl: "./input.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent extends BaseInputComponent {
  // @Input() override label: string = "";
  @Input() override formControl: FormControl = new FormControl("");
  @Input() placeholder: string = "";
  @Input() override type: string = "text";
  @Input() id: string = "";
  @Input() autocomplete: string = "";
}
