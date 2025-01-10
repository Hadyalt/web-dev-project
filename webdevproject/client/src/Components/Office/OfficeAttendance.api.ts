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

export const updateOfficeAttendance = async (updatedOffice: Office): Promise<void> => {
    const response = await fetch(`http://localhost:3001/api/v1/office/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedOffice),
    });

    if (!response.ok) {
        throw new Error("Failed to update office attendance");
    }
}

export const attendOffice = async (attendance: { officeId: number, userId: number, attendanceDate: string }): Promise<void> => {
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