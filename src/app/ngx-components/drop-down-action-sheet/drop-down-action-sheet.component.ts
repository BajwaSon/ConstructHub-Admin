/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, inject, Input, Output } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-drop-down-action-sheet",
  imports: [FormsModule],
  templateUrl: "./drop-down-action-sheet.component.html",
  styleUrl: "./drop-down-action-sheet.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropDownActionSheetComponent),
      multi: true,
    },
  ],
})
export class DropDownActionSheetComponent implements ControlValueAccessor {
  value: any;

  get textLabel() {
    return this.options.find(option => option.value === this.value)?.text || "";
  }

  @Input() options: {
    text: string;
    value: string | number;
  }[] = [];

  @Input() fullWidth = false;
  @Input() lineHeight = 1.5;
  @Output() valueChange = new EventEmitter<any>(); // Emit selected month

  // actionSheet = inject(ActionSheetController);
  cd = inject(ChangeDetectorRef);

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
    this.cd.detectChanges();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(): void {}

  onChange(value: any): void {
    this.onChangeFn(value);
  }

  onTouched(): void {
    this.onTouchedFn();
  }

  async openActionSheet() {
    // const buttons: any[] = this.options.map(option => ({
    //   text: option.text,
    //   handler: () => {
    //     this.writeValue(option.value);
    //     this.onChangeFn(option.value);
    //     this.valueChange.emit(option); // Emit selected month
    //   },
    // }));
    // buttons.push({
    //   text: "Cancel",
    //   role: "cancel",
    // });
    // const actionSheet = await this.actionSheet.create({
    //   header: "Select an Option",
    //   buttons: buttons,
    // });
    // await actionSheet.present();
  }
}
