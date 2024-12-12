import { ViewState } from "./dashboard.state";

export interface DashboardPostState {
    view: ViewState
}

export const initDashboardPostState: DashboardPostState = {
    view: "dashboardPost"
}