import { DashboardState, ViewState } from "../Dashboard/dashboard.state";

export interface DashboardPostState {
    view: ViewState;
    title: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
}

export const initDashboardPostState: DashboardPostState = {
    view: "dashboardPost",
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",

};