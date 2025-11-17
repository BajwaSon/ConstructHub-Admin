import { Component, Input, forwardRef, OnInit, OnChanges } from "@angular/core";
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

import { BaseInputComponent } from "../baseInput.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-select",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./select.component.html",
  styleUrl: "./select.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent extends BaseInputComponent implements OnInit, OnChanges {
  @Input() override label: string = "";
  @Input() override formControl: FormControl = new FormControl("");
  @Input() options: { label: string; value: string }[] = [];

  ngOnInit() {
    if (this.readonly) {
      this.formControl.disable();
    }
  }

  ngOnChanges() {
    if (this.readonly) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }
}
