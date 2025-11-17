/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ClickOutsideDirective, RippleButtonDirective } from "@jot143/core-angular";

@Component({
  selector: "app-select-dropdown",
  imports: [ClickOutsideDirective, RippleButtonDirective, CommonModule],
  templateUrl: "./select-dropdown.component.html",
  styleUrl: "./select-dropdown.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDropdownComponent implements OnInit {
  @ViewChild("optionMenu") optionMenu!: ElementRef;

  selectedOption: any = null;
  @Input() selectedValue?: string | null | number = null;
  @Input() options: { label: string; value: any }[] = [];
  @Output() selectedValueChange = new EventEmitter<any>();
  ngOnInit() {
    if (this.options.length > 0) {
      this.selectedOption = this.options.find(option => option.value == this.selectedValue) || this.options[0];
      this.selectedValueChange.emit(this.selectedOption);
    }
  }

  onOptionSelect(e: Event, option: { label: string; value: any }) {
    this.selectedOption = option;
    this.selectedValueChange.emit(option);
    this.optionMenu.nativeElement.classList?.remove("active");
  }

  toggleOptions() {
    this.optionMenu.nativeElement.classList?.toggle("active");
  }
}
