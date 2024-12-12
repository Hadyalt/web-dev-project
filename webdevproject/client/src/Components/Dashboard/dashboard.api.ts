import { Event } from "./dashboard.state"

export const loadEvent = (): Promise<Event[]> => {
	return new Promise((resolve) => {
		const events: Event[] = []; // Replace with actual event loading logic
		resolve(events);
	});
}