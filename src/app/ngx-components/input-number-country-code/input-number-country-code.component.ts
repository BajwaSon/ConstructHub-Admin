/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostListener, Input, ViewChild } from "@angular/core";
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputComponent } from "../baseInput.component";
import { countries, countryCodes } from "../../common/options/countryCodes";

@Component({
  selector: "app-input-number-country-code",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./input-number-country-code.component.html",
  styleUrl: "./input-number-country-code.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberCountryCodeComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberCountryCodeComponent extends BaseInputComponent {
  selectedCountryCode: string = "+971"; // Default country code
  countries = countries;
  countryCodes = countryCodes;

  @Input() override label: string = "";
  @Input() override formControl: FormControl = new FormControl("");
  @Input() defaultCountry = "ae";
  @Input() placeholder?: string = "";
  @ViewChild("dropdownElement", { static: false }) dropdownElement!: ElementRef;
  separateDialCode = true;
  preferredCountries = ["in", "ae"];
  @ViewChild("telInputElement", { static: false }) telInputElement!: ElementRef;

  selectedCountry: any;
  dropdownOpen = false;

  constructor() {
    super();
    this.selectedCountry = this.countries.find(c => c.code === this.defaultCountry) || this.countries[0];
    this.selectedCountryCode = this.selectedCountry?.code || "+971";
  }

  getFlagPath(countryCode: string): string {
    // Remove the + prefix and get the ISO code
    const code = countryCode.replace("+", "");
    const isoCode = this.countryCodes[code]?.toLowerCase();
    return isoCode ? `/assets/flags/${isoCode}.svg` : "";
  }

  selectCountry(country: any) {
    this.selectedCountry = country;
    this.selectedCountryCode = country.code;
    this.dropdownOpen = false;
  }

  onInputChange(event: any) {
    const inputValue = event.target.value.replace(/^\+\d+/, ""); // Remove existing country code
    this.formControl.setValue(inputValue, { emitEvent: true }); // Update only the number
  }

  getFullNumber(): string {
    return this.selectedCountryCode + this.formControl.value;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event) {
    if (this.dropdownElement && this.dropdownElement.nativeElement && !this.dropdownElement.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
