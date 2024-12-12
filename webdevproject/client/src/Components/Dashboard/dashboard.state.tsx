import { DateOnly, TimeSpan } from "../../Models/Date"

export type ViewState = "dashboard" | "dashboardPost"

export type Event_Attendance =
{
    Event_AttendanceId : number,
    Rating : number,
    Feedback : string,
    UserId : number,
    EventId : number
}

export type Event = 
{
    eventId : number,
    title : string,
    description : string,
    eventDate : DateOnly,
    startTime : TimeSpan,
    endTime : TimeSpan,
    location : string,
    adminApproval : boolean,
    event_Attendances : Event_Attendance[]
}

export interface DashboardState {
    events: Event[];
    loading: boolean;
    error: string | null;
    view: ViewState
    updateViewState : (view:ViewState) => (state:DashboardState) => DashboardState
}

export const initDashboardState : DashboardState ={
    events : [],
    loading: true,
    error: "",
    view: "dashboard",
    updateViewState : (view:ViewState) => (state:DashboardState):DashboardState => 
        {
            return{
                ...state,
            view : view
            }
        }
}