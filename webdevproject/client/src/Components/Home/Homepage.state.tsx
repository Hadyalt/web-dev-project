import { DateOnly, TimeSpan } from "../../Models/Date";

export type ViewState = "homepage" | "eventDetails";

export type Event_Attendance = {
    Event_AttendanceId: number;
    Rating: number;
    Feedback: string;
    UserId: number;
    EventId: number;
};

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

export interface HomepageState {
    selectedEventId: number;
    events: Event[];
    loading: boolean;
    error: string | null;
    view: ViewState;
    showModal: boolean; // To manage the visibility of the modal
    updateViewState: (view: ViewState) => (state: HomepageState) => HomepageState;
}

export const initHomepageState: HomepageState = {
    selectedEventId: 1,
    events: [],
    loading: true,
    error: "",
    view: "homepage",
    showModal: false, // Modal is initially hidden
    updateViewState: (view: ViewState) => (state: HomepageState): HomepageState => {
        return {
            ...state,
            view: view
        };
    }
};