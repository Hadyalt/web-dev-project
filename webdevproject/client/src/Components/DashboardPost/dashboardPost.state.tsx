import { DashboardState, ViewState } from "../Dashboard/dashboard.state";

export interface DashboardPostState {
    view: ViewState;
    title: string;
    description: string;
    Date: string;
    startTime: string;
    endTime: string;
    location: string;
    ReviewFeedback: string;
    adminApproval: boolean;
    event_Attendances: [];
}

export const initDashboardPostState: DashboardPostState = {
    view: "dashboardPost",
    title: "",
    description: "",
    Date: "",
    startTime: "",
    endTime: "",
    location: "",
    ReviewFeedback: "",
    adminApproval: false,
    event_Attendances: []
};