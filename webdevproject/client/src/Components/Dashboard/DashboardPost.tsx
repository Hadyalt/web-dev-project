import React from "react";
import { DashboardPostState, initDashboardPostState } from "./dashboardPost.state.tsx";

export class DashboardPostForm extends React.Component<{}, DashboardPostState> {
  constructor(props: {}) {
    super(props);
    this.state = initDashboardPostState;
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<DashboardPostState, keyof DashboardPostState>);
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form data to the POST endpoint
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
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
            <input type="date" name="eventDate" value={this.state.eventDate} onChange={this.handleChange} />
          </div>
          <div>
            <label>Start Time:</label>
            <input type="time" name="startTime" value={this.state.startTime} onChange={this.handleChange} />
          </div>
          <div>
            <label>End Time:</label>
            <input type="time" name="endTime" value={this.state.endTime} onChange={this.handleChange} />
          </div>
          <div>
            <label>Location:</label>
            <input type="text" name="location" value={this.state.location} onChange={this.handleChange} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}