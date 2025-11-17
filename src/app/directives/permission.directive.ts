/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { StateService } from "@jot143/core-angular";

@Directive({
  selector: "[appPermission]",
})
export class PermissionDirective {
  private requiredPermissions: string[] = [];

  constructor(
    private stateService: StateService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set appPermission(permissions: string[]) {
    this.requiredPermissions = permissions;
    this.updateView();
  }

  private updateView() {
    const permissions = this.getUserPermissions();

    if (this.hasPermission(permissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private getUserPermissions(): string[] {
    return this.stateService?.user?.role?.permissions?.map((permission: any) => permission.name) || []; // Ensure it always returns an array
  }

  private hasPermission(permissions: string[]): boolean {
    if (!permissions || permissions.length === 0) {
      return false; // Prevent errors if permissions are undefined or empty
    }
    return this.requiredPermissions.some(role => permissions.includes(role));
  }
}
