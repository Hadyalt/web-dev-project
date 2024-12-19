import React from "react";
import { DashboardPostState, initDashboardPostState } from "./dashboardPost.state.tsx";
import { postEvent } from "./dashboardPost.api.ts";
import { DateOnly } from "../../Models/Date.tsx";

interface DashboardPostFormProps {
  backToHome: () => void;
}

export class DashboardPostForm extends React.Component<DashboardPostFormProps, DashboardPostState> {
  constructor(props: DashboardPostFormProps) {
    super(props);
    this.state = { ...initDashboardPostState };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name in this.state) {
      this.setState({ [name]: value } as unknown as Pick<DashboardPostState, keyof DashboardPostState>);
    }
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call the API to post the event
    const formattedDate = DateOnly.parse(this.state.Date).toString();
    await postEvent(this.state.title, this.state.description, formattedDate, this.state.startTime,
      this.state.endTime, this.state.location, this.state.adminApproval, this.state.event_Attendances, this.state.ReviewFeedback)
      .then(() => {
        // Redirect to the dashboard
        this.props.backToHome();
      })
      .catch(() => {
        // Handle the error
      });
    this.props.backToHome();
  };

  render() {
    return (
      <div>
        <h1>Events form</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />
          </div>
          <div>
            <label>Description:</label>
            <textarea name="description" value={this.state.description} onChange={this.handleChange} />
          </div>
          <div>
            <label>Event Date:</label>
            <input type="date" name="Date" value={this.state.Date} onChange={this.handleChange} />
          </div>
          <div>
            <label>Start Time:</label>
            <input type="time" name="startTime" value={this.state.startTime} onChange={this.handleChange} step="1" />
          </div>
          <div>
            <label>End Time:</label>
            <input type="time" name="endTime" value={this.state.endTime} onChange={this.handleChange} step="1" />
          </div>
          <div>
            <label>Location:</label>
            <input type="text" name="location" value={this.state.location} onChange={this.handleChange} />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => this.props.backToHome()}> Back </button>
        </form>
      </div>
    );
  }
}