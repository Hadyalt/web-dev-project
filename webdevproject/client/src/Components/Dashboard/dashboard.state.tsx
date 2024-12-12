import { DateOnly, TimeSpan } from "../../Models/Date"

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