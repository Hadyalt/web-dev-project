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

        const styles: { [key: string]: React.CSSProperties } = {
            container: {
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                maxWidth: "600px",
                margin: "auto",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
            table: {
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
            },
            th: {
                backgroundColor: "#0056b3",
                color: "white",
                padding: "12px",
                textAlign: "left" as const,
                borderBottom: "2px solid #e0e0e0",
            },
            td: {
                padding: "12px",
                textAlign: "left" as const,
                borderBottom: "1px solid #e0e0e0",
            },
            button: {
                padding: "10px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.3s ease, transform 0.2s ease",
            },
            buttonHover: {
                backgroundColor: "#0056b3",
                transform: "translateY(-2px)",
            },
            heading: {
                textAlign: "center" as const,
                marginBottom: "20px",
            },
            officeList: {
                listStyle: "none",
                padding: "0",
                margin: "0",
            },
            listItem: {
                padding: "10px 15px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            },
            listItemHover: {
                backgroundColor: "#f0f8ff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
            errorMessage: {
                color: "red",
                fontSize: "14px",
                marginTop: "10px",
            },
        };


        return (
            <div className="office-attendance" style={styles.container}>
                <h2 style={styles.heading}>Offices</h2>
                <ul className="office-list" style={styles.officeList}>
                    {offices.map((office) => (
                        <li
                            key={office.officeId}
                            style={styles.listItem}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.listItemHover.backgroundColor || ''}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                            onClick={() => this.handleOfficeClick(office.officeId)}
                        >
                            Office {office.officeId} - {office.date} from {office.startTime} to {office.endTime}
                        </li>
                    ))}
                </ul>
                {selectedOffice && !isAttending && (
                    <button
                        className="attend-button"
                        style={styles.button}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor || ''}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor || ''}
                        onClick={this.attendOffice}
                    >
                        Attend Office
                    </button>
                )}
                {isAttending && <p>You are attending office {selectedOffice?.officeId}</p>}
                <button
                    className="back-button"
                    style={styles.button}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor || ''}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor || ''}
                    onClick={() => (window.location.href = '/homepage')}
                >
                    Back
                </button>
                {error && <p className="error-message" style={styles.errorMessage}>{error}</p>}
            </div>
        );

    }
}