import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "form[appSubmitOnEnter]",
})
export class SubmitOnEnterDirective {
  @HostListener("keydown.enter", ["$event"])
  @HostListener("keyup.enter", ["$event"])
  onEnter(event: KeyboardEvent) {
    // Prevent default form submission
    event.preventDefault();

    // Always find the closest parent form from the event target
    const form = (event.target as HTMLElement).closest("form");
    if (!form) return;

    // Find the first enabled submit button in the form
    const submitButton = form.querySelector('button[type="submit"]:not(:disabled)') as HTMLButtonElement;

    // If submit button exists and is not disabled, click it
    if (submitButton) {
      submitButton.click();
    }
  }
}
