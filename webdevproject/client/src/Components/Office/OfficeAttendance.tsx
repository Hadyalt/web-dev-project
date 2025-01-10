import React from "react";
import { Office, OfficeAttendanceState, initOfficeAttendanceState } from "./OfficeAttendance.state";
import { attendOffice, fetchOffices, IsUserAttending } from "./OfficeAttendance.api";

interface OfficeAttendanceProps {
    backToHome: () => void;
}

interface OfficeAttendanceStateExtended extends OfficeAttendanceState {
    offices: Office[];
    selectedOffice: Office | null;
    isAttending: boolean;
    error: string | null;
}

export class OfficeAttendance extends React.Component<OfficeAttendanceProps, OfficeAttendanceStateExtended> {
    constructor(props: OfficeAttendanceProps) {
        super(props);
        this.state = {
            ...initOfficeAttendanceState,
            offices: [],
            isAttending: false,
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
        const { selectedOffice } = this.state;
        if (!selectedOffice) {
            this.setState({ error: "No office selected" });
            return;
        }

        try {
            const userId = Number(sessionStorage.getItem('userId'));
            const isUserAttending = await IsUserAttending(selectedOffice.officeId);
            console.log("IsUserAttending:", isUserAttending);

            if (!(isUserAttending.length === 0)) {
                this.setState({ error: "You are already attending the office" });
                return;
            }

            const updatedOffice = { ...selectedOffice, userId };
            await attendOffice({
                officeId: updatedOffice.officeId,
                userId: updatedOffice.userId,
            });

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
        const { isAttending, error, offices, selectedOffice } = this.state;

        return (
            <div>
                <h2>Offices</h2>
                <ul>
                    {offices.map((office) => (
                        <li key={office.officeId} onClick={() => this.handleOfficeClick(office.officeId)}>
                            Office {office.officeId} - {office.date} from {office.startTime} to {office.endTime}
                        </li>
                    ))}
                </ul>
                {selectedOffice && !isAttending && (
                    <button onClick={this.attendOffice}>Attend Office</button>
                )}
                {isAttending && <p>You are attending office {selectedOffice?.officeId}</p>}
                <button onClick={() => window.location.href = '/homepage'}>Back</button>
                {error && <p>{error}</p>}
            </div>
        );
    }
}