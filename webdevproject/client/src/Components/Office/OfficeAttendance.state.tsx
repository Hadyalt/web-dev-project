import { DateOnly } from "../../Models/Date";

export interface OfficeAttendanceState {
    attendanceDate: DateOnly;
    isAttending: boolean;
    loading: boolean;
    error: string | null;
    selectedOffice: Office | null;
}

export const initOfficeAttendanceState: OfficeAttendanceState = {
    attendanceDate: new DateOnly(2023, 10, 5), 
    isAttending: false,
    loading: false,
    error: null,
    selectedOffice: null,
};

export interface Office {
    officeId: number;
    date: string;
    startTime: string;
    endTime: string;
}

export interface OfficeAttendance {
    officeId: number;
    userId: number;
}
