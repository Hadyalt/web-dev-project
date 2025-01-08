import { DateOnly, TimeSpan } from "../../Models/Date";

export type ViewState = "dashboard" | "dashboardPost" | "dashboardPatch" | "homepage" | "eventDetails" | "login" | "voting"

export type Event_Attendance = {
    Event_AttendanceId: number;
    Rating: number;
    Feedback: string;
    UserId: number;
    EventId: number;
}

export type Attendance = {
    userId: number;
    feedback: string;
    rating: number;
}

export type Event = {
    eventId: number;
    title: string;
    description: string;
    eventDate: DateOnly;
    startTime: TimeSpan;
    endTime: TimeSpan;
    location: string;
    adminApproval: boolean;
    event_Attendances: Event_Attendance[];
};

export interface DashboardState {
    selectedEventId: number;
    events: Event[];
    loading: boolean;
    error: string | null;
    view: ViewState;
    showModal: boolean; // To manage the visibility of the modal
    showAttendee: boolean;
    eventToDelete: number | null; // Stores the ID of the event to delete
    attendance: Attendance[]; // Stores the list of attendees for an event
    loadingAttendance: boolean; // Tracks whether attendance data is being loaded
    updateViewState: (view: ViewState) => (state: DashboardState) => DashboardState;
}

export const initDashboardState: DashboardState = {
    selectedEventId: 0,
    events: [],
    loading: true,
    error: "",
    view: "dashboard",
    showModal: false, // Modal is initially hidden
    showAttendee: false,
    eventToDelete: null, // No event selected for deletion
    attendance: [], // Initialize with an empty list
    loadingAttendance: false, // Initially not loading attendance
    updateViewState: (view: ViewState) => (state: DashboardState): DashboardState => {
        return {
            ...state,
            view: view
        };
    }
};
