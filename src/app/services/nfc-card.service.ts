/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal, RequestLoader } from "@jot143/core-angular";
import { NfcCard } from "../model/NfcCard";

@Injectable({
  providedIn: "root",
})
export class NfcCardService {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  api = {
    getAllNfcCards: "iot.teacherNfcId.getAll",
    addNfcCards: "iot.teacherNfcId.create",
    updateNfcCards: "iot.teacherNfcId.update",
    deleteNfcCards: "iot.teacherNfcId.delete",
  };

  sideBarOpen = coreSignal(false);
  actionSheetOpen = false;
  nfcCards = coreSignal<NfcCard[]>([]);
  getAllNfcCards(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getAllNfcCards);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.nfcCards.setValue(await NfcCard.createFromArray(apiCall.response.data));
          return;
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async (err: Error) => {
        this.alertService.error(err.message);
      },
    });

    apiCall.exe().subscribe();

    return apiCall;
  }

  addNfcCards({ macId, teacherId }: { macId: string; teacherId: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.addNfcCards);
    apiCall.data = { macId, teacherId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateNfcCards({ id, macId, teacherId }: { id: string; macId: string; teacherId: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.updateNfcCards);
    apiCall.loader = loader;
    const data: any = { id, macId, teacherId };
    apiCall.data = data;
    apiCall.exe().subscribe();
    return apiCall;
  }

  deleteNfcCards({ id }: { id: number }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.deleteNfcCards);
    apiCall.loader = loader;
    apiCall.data = { id };
    apiCall.exe().subscribe();
    return apiCall;
  }
}
