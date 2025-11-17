/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";
import { AlertService, RequestLoader, UserService } from "@jot143/core-angular";

@Injectable({
  providedIn: "root",
})
export class SettingService extends UserService {
  settingApi = {
    updateEmail: "auth.user.updateEmail",
    updateEmailSendOtp: "auth.user.updateEmailSendOtp",
    updateEmailVerifyStore: "auth.user.updateEmailVerifyStore",
    updatePushNotifications: "auth.user.updatePushNotifications",
    updateFaceID: "auth.user.updateFaceID",
    updatePassword: "auth.user.updatePassword",
    updateLocation: "auth.user.updateLocation",
    updatePhoneSendOtp: "auth.user.updatePhoneSendOtp",
    updatePhoneVerifyStore: "auth.user.updatePhoneVerifyStore",
    updatePhone: "auth.user.updatePhone",
  };

  alertService = inject(AlertService);

  apiCallUpdatePassword = {
    updateTeacherPassword: "master.teacher.updatePassword",
    updateNursePassword: "master.nurse.updatePassword",
    updateStudentPassword: "master.student.updatePassword",
    updateParentPassword: "master.parent.updatePassword",
    updateAdminPassword: "master.admin.updatePassword",
    updateAssistantPassword: "master.assistant.updatePassword",
    updateDriverPassword: "master.driver.updatePassword",
  };
  apiCallSendOtp = {
    updateTeacherPhoneSendOtp: "master.admin.updateEmailSendOtp",
    updateNursePhoneSendOtp: "master.admin.updateEmailSendOtp",
    updateStudentPhoneSendOtp: "master.admin.updateEmailSendOtp",
    updateParentPhoneSendOtp: "master.admin.updateEmailSendOtp",
    updateAdminPhoneSendOtp: "master.admin.updateEmailSendOtp",
    updateAssistantPhoneSendOtp: "master.admin.updateEmailSendOtp",
    updateDriverPhoneSendOtp: "master.admin.updateEmailSendOtp",
  };

  apiCallVerifyOtp = {
    updateTeacherPhoneVerifyStore: "master.admin.updateEmailVerifyStore",
    updateNursePhoneVerifyStore: "master.admin.updateEmailVerifyStore",
    updateStudentPhoneVerifyStore: "master.admin.updateEmailVerifyStore",
    updateParentPhoneVerifyStore: "master.admin.updateEmailVerifyStore",
    updateAdminPhoneVerifyStore: "master.admin.updateEmailVerifyStore",
    updateAssistantPhoneVerifyStore: "master.admin.updateEmailVerifyStore",
    updateDriverPhoneVerifyStore: "master.admin.updateEmailVerifyStore",
  };
  // forget password

  updateEmail({ email }: { email: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.settingApi.updateEmail);
    apiCall.data = { email };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  // updateEmailSendOtp({ email }: { email: string }) {
  //   const apiCall = this.apiService.apiCall(this.settingApi.updateEmailSendOtp);
  //   apiCall.data = { email };
  //   apiCall.exe().subscribe();
  //   return apiCall;
  // }
  updatePushNotifications({ pushNotifications }: { pushNotifications: number }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.settingApi.updatePushNotifications);
    apiCall.data = { pushNotifications };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  updateFaceID({ faceId }: { faceId: number }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.settingApi.updateFaceID);
    apiCall.data = { faceId };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  updatePassword({ currentPassword, newPassword, role }: { currentPassword: string; newPassword: string; role: string }, loader = new RequestLoader()) {
    const roleApiMap: { [key: string]: string } = {
      teacher: this.apiCallUpdatePassword.updateTeacherPassword,
      nurse: this.apiCallUpdatePassword.updateNursePassword,
      student: this.apiCallUpdatePassword.updateStudentPassword,
      parent: this.apiCallUpdatePassword.updateParentPassword,
      admin: this.apiCallUpdatePassword.updateAdminPassword,
      assistant: this.apiCallUpdatePassword.updateAssistantPassword,
      driver: this.apiCallUpdatePassword.updateDriverPassword,
    };

    const apiEndpoint = roleApiMap[role.toLowerCase()];
    const apiCall = this.apiService.apiCall(apiEndpoint);
    apiCall.loader = loader;
    apiCall.data = { currentPassword, newPassword };
    apiCall.exe().subscribe();

    return apiCall;
  }

  updateLocation(
    {
      name,
      apartmentOrVilla,
      street,
      neighborhood,
      city,
      // state,
      // country,
    }: {
      name: string;
      apartmentOrVilla: string;
      street: string;
      neighborhood: string;
      city: string;
      // state?: string;
      // country?: string;
    },
    loader = new RequestLoader()
  ) {
    const apiCall = this.apiService.apiCall(this.settingApi.updateLocation);
    apiCall.data = { name, apartmentOrVilla, street, neighborhood, city };
    // apiCall.data = { name, apartmentOrVilla, street, neighborhood, city, state, country };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  updatePhoneSendOtp({ phoneNo, role }: { phoneNo: any; role: string }, loader = new RequestLoader()) {
    const roleApiMap: { [key: string]: string } = {
      teacher: this.apiCallSendOtp.updateTeacherPhoneSendOtp,
      nurse: this.apiCallSendOtp.updateNursePhoneSendOtp,
      student: this.apiCallSendOtp.updateStudentPhoneSendOtp,
      parent: this.apiCallSendOtp.updateParentPhoneSendOtp,
      admin: this.apiCallSendOtp.updateAdminPhoneSendOtp,
      assistant: this.apiCallSendOtp.updateAssistantPhoneSendOtp,
      driver: this.apiCallSendOtp.updateDriverPhoneSendOtp,
    };

    const apiEndpoint = roleApiMap[role.toLowerCase()];
    const apiCall = this.apiService.apiCall(apiEndpoint);
    apiCall.data = { phoneNo };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  updateEmailSendOtp({ email, role }: { email: any; role: string }, loader = new RequestLoader()) {
    const roleApiMap: { [key: string]: string } = {
      teacher: this.apiCallSendOtp.updateTeacherPhoneSendOtp,
      nurse: this.apiCallSendOtp.updateNursePhoneSendOtp,
      student: this.apiCallSendOtp.updateStudentPhoneSendOtp,
      parent: this.apiCallSendOtp.updateParentPhoneSendOtp,
      admin: this.apiCallSendOtp.updateAdminPhoneSendOtp,
      assistant: this.apiCallSendOtp.updateAssistantPhoneSendOtp,
      driver: this.apiCallSendOtp.updateDriverPhoneSendOtp,
    };

    const apiEndpoint = roleApiMap[role.toLowerCase()];
    const apiCall = this.apiService.apiCall(apiEndpoint);
    apiCall.data = { email };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  updateEmailVerifyStore({ email, otp, role }: { email: any; otp: string | number; role: string }, loader = new RequestLoader()) {
    const roleApiMap: { [key: string]: string } = {
      teacher: this.apiCallVerifyOtp.updateTeacherPhoneVerifyStore,
      nurse: this.apiCallVerifyOtp.updateNursePhoneVerifyStore,
      student: this.apiCallVerifyOtp.updateStudentPhoneVerifyStore,
      parent: this.apiCallVerifyOtp.updateParentPhoneVerifyStore,
      admin: this.apiCallVerifyOtp.updateAdminPhoneVerifyStore,
      assistant: this.apiCallVerifyOtp.updateAssistantPhoneVerifyStore,
      driver: this.apiCallVerifyOtp.updateDriverPhoneVerifyStore,
    };

    const apiEndpoint = roleApiMap[role.toLowerCase()];

    const apiCall = this.apiService.apiCall(apiEndpoint);
    apiCall.data = { email, otp };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
  updatePhone({ phoneNo }: { phoneNo: string }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.settingApi.updatePhone);
    apiCall.data = { phoneNo };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }
}
