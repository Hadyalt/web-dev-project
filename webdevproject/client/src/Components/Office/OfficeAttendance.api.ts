import { Office } from "./OfficeAttendance.state";

export async function fetchOffices(): Promise<Office[]> {
    const response = await fetch("http://localhost:3001/api/v1/office/read");
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch offices: ${errorText}`);
    }
    try {
        return await response.json();
    } catch (error) {
        throw new Error("Failed to parse JSON response");
    }
}

export const attendOffice = async (attendance: { officeId: number, userId: number}): Promise<void> => {
    const response = await fetch(`http://localhost:3001/api/v1/office/attend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(attendance),
    });

    if (!response.ok) {
        throw new Error("Failed to save office attendance");
    }
}

export const IsUserAttending = async (officeId: number): Promise<any[]> => {
    const response = await fetch(`http://localhost:3001/api/v1/office/IsUserAttending/${officeId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch user attendance");
    }
    return await response.json();
}