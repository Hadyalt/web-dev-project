import React from "react";
import { Office, OfficeAttendanceState, initOfficeAttendanceState } from "./OfficeAttendance.state";
import { fetchOffices, updateOfficeAttendance } from "./OfficeAttendance.api";

interface OfficeAttendanceProps {
    backToHome: () => void;
}

interface OfficeAttendanceStateExtended extends OfficeAttendanceState {
    offices: Office[];
}

export class OfficeAttendance extends React.Component<OfficeAttendanceProps, OfficeAttendanceStateExtended> {
    constructor(props: OfficeAttendanceProps) {
        super(props);
        this.state = {
            ...initOfficeAttendanceState,
            offices: [],
        };
    }

    componentDidMount() {
        this.loadOffices();
    }

    loadOffices = async () => {
        try {
            const offices = await fetchOffices();
            this.setState({ offices });
        } catch (error) {
            this.setState({ error: (error as Error).message });
        }
    };

    handleOfficeClick = (officeId: number) => {
        const { offices } = this.state;
        const office = offices.find((office) => office.officeId === officeId);
        if (!office) {
            this.setState({ error: "Office not found" });
            return;
        }
        this.setState({ selectedOffice: office });
    };

    attendOffice = async () => {
        const { selectedOffice, isAttending } = this.state;
        if (!selectedOffice) {
            this.setState({ error: "No office selected" });
            return;
        }
    
        if (isAttending || selectedOffice.isOccupied === true)   {
            this.setState({ error: "You are already attending this office" });
            return;
        }
    
        const updatedOffice = { ...selectedOffice, isOccupied: true, userId: Number(sessionStorage.getItem('userId')) };
        try {
            await updateOfficeAttendance(updatedOffice);
            this.setState((prevState) => ({
                offices: prevState.offices.map((office) =>
                    office.officeId === updatedOffice.officeId ? updatedOffice : office
                ),
                selectedOffice: updatedOffice,
                isAttending: true,
            }));
        } catch (error) {
            this.setState({ error: (error as Error).message });
        }
    };

    render() {
        const { attendanceDate, isAttending, loading, error, offices, selectedOffice } = this.state;

        return (
            <div>
                <h2>Offices</h2>
                <ul>
                    {offices.map((office) => (
                        <li key={office.officeId} onClick={() => this.handleOfficeClick(office.officeId)}>
                            Office {office.officeId} - {office.date} {office.startTime} to {office.endTime} this office is {office.isOccupied ? "Occupied" : "Available"}
                        </li>
                    ))}
                </ul>
                {selectedOffice && !isAttending && (
                    <button onClick={this.attendOffice}>Attend Office</button>
                )}
                {isAttending && <p>You are attending office {selectedOffice?.officeId}</p>}
                <button onClick={() => window.location.href='/homepage'}>Back</button>
                {error && <p>{error}</p>}
            </div>
        );
    }
}