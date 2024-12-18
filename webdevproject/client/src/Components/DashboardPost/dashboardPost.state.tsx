import { ViewState } from "../Dashboard/dashboard.state";

export interface DashboardPostState {
    view: ViewState;
    title: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
    adminApproval: boolean;
    event_Attendances: [];
}

export const initDashboardPostState: DashboardPostState = {
    title: '',
    description: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    adminApproval: false,
    event_Attendances: [],
    view: "dashboard"
};
