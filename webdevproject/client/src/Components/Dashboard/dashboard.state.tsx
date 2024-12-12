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
    EventId : number,
    Title : string,
    Description : string,
    EventDate : DateOnly,
    StartTime : TimeSpan,
    EndTime : TimeSpan,
    Location : string,
    AdminApproval : boolean,
    Event_Attendances : Event_Attendance[]
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