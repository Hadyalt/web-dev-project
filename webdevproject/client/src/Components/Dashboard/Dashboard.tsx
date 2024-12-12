import React from "react"
import { Event } from "./dashboard.state"
import { loadEvent } from "./dashboard.api";


export interface DashboardProps
{
    backToHome : () => void
}

interface DashboardState 
{
    events: Event[];
    loading: boolean;
    error: string | null;
  }

export class DashboardForm extends React.Component<DashboardProps, DashboardState>
{
    constructor(props : DashboardProps)
    {
        super(props)
        this.state = {
            events: [],
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        // Load events when the component mounts
        loadEvent()
          .then((events) => {
            this.setState({ events, loading: false });
          })
          .catch((error) => {
            this.setState({ error: error.message, loading: false });
          });
      }



      render() {
        const { loading, error, events } = this.state;
    
        return (
          <div>
            <div>
              <h1>Welcome to our Dashboard Page! test</h1>
              <button onClick={this.props.backToHome}>Back</button>
            </div>
    
            {/* Loading state */}
            {loading && <p>Loading events...</p>}
    
            {/* Error handling */}
            {error && <p>Error: {error}</p>}
    
            {/* Display events in a table */}
            {!loading && !error && (
              <table>
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Location</th>
                    <th>Admin Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.EventId}>
                      <td>{event.Title}</td>
                      <td>{event.Description}</td>
                      <td>{event.EventDate.toString()}</td>
                      <td>{event.StartTime.toString()}</td>
                      <td>{event.EndTime.toString()}</td>
                      <td>{event.Location}</td>
                      <td>{event.AdminApproval ? "Approved" : "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      }
    }