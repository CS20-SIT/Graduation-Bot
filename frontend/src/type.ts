export enum Honor {
  First = "First Class Honors",
  Second = "Second Class Honors",
}
export interface OnboardingData {
  lineUserId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  nickName: string;
  mobileNo: string;
  honor: Honor | null;
  currentJob: string | null;
  currentCompany: string | null;
  fallbackMessage: string;
  channelAccessToken: string;
}
export enum FieldType {
  Text,
  Select,
}
export interface FieldOption {
  value: string;
  label: string;
}
export interface Field {
  name: keyof OnboardingData;
  type: FieldType;
  options?: Array<FieldOption>;
  required?: boolean;
  validation?: (value: string) => boolean;
  errorMessage?: string;
}
