import { DateOnly, TimeSpan } from "../../Models/Date";
import { Vote } from "../Voting/Voting.state";

export type ViewState = "dashboard" | "dashboardPost" | "dashboardPatch" | "homepage" | "eventDetails" | "login" | "officeAttendance" | "voting" | "votePatch" | "homepageReview" | "eventDetailsOpen";

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
    selectedVoteId: number;
    events: Event[];
    voteEvents: Vote[];
    loading: boolean;
    error: string | null;
    view: ViewState;
    showModal: boolean; 
    showModal2: boolean,
    showAttendee: boolean;
    voteToDelete: number | null;
    eventToDelete: number | null; 
    attendance: Attendance[]; 
    loadingAttendance: boolean;
    updateViewState: (view: ViewState) => (state: DashboardState) => DashboardState;
}

export const initDashboardState: DashboardState = {
    selectedEventId: 0,
    selectedVoteId: 0,
    events: [],
    voteEvents: [],
    loading: true,
    error: "",
    view: "dashboard",
    showModal: false, 
    showModal2: false,
    showAttendee: false,
    voteToDelete: null,
    eventToDelete: null, 
    attendance: [], 
    loadingAttendance: false,
    updateViewState: (view: ViewState) => (state: DashboardState): DashboardState => {
        return {
            ...state,
            view: view
        };
    }
};
