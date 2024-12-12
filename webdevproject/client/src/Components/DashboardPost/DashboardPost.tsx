import React from "react";
import { Event, ViewState } from "../Dashboard/dashboard.state.tsx";
import { loadEvent } from "../Dashboard/dashboard.api.ts";
import { DashboardPostState } from "./dashboardPost.state.tsx";

export interface DashboardPostProps
{
    backToHome : () => void
}



export class DashboardPostForm extends React.Component<DashboardPostProps, DashboardPostState> {
  constructor(props: DashboardPostProps) {
    super(props);
    this.state = {
      view: "dashboardPost"
    }
  }

  render() {
    return (
      <div>
        <h1>Events</h1>
      </div>
    );
  }
}