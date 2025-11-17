export interface HealthData {
  heartRate: { value: number; timestamp: number }[];
  bodyTemperature: { value: number; timestamp: number }[];
  bloodPressure: { value: number; timestamp: number }[];
  breathingRate: { value: number; timestamp: number }[];
  calories: { value: number; timestamp: number }[];
  hrv: { value: number; timestamp: number }[];
  sleepHours: { value: number; timestamp: number }[];
  spo2: { value: number; timestamp: number }[];
  stressValue: { value: number; timestamp: number }[];
  timestamp: number[];
}
