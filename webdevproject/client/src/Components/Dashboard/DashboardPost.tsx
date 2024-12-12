import React from "react";
import { Event, ViewState } from "./dashboard.state";
import { loadEvent } from "./dashboard.api.ts";
import { DashboardPostState } from "../dashboardPost.state.tsx";

export interface DashboardPostProps
{
    backToHome : () => void
}



export class DashboardPostForm extends React.Component<DashboardPostProps, DashboardPostState> {
  constructor(props: DashboardPostProps) {
    super(props);
    this.state = {
      
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