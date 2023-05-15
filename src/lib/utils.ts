import { type Config, adjectives, colors, animals, uniqueNamesGenerator } from "unique-names-generator"

export function generateRandomUsername(): string {
    const config: Config = {
        dictionaries: [adjectives, colors, animals],
        separator: "-"
    }

    return uniqueNamesGenerator(config)
}

export const msToDateString = (ms: number) => {
	const date = new Date(ms); // create a new Date object from milliseconds

	const month = date.getMonth() + 1; // months start from 0, so add 1 to get the correct month number
	const day = date.getDate();
	const year = date.getFullYear();

	const hours = date.getHours();
	const minutes = date.getMinutes();
	const amOrPm = hours >= 12 ? 'PM' : 'AM'; // check if the hour is in AM or PM

	const twelveHourFormatHours = hours % 12 || 12; // convert to 12-hour format
	const formattedHours = twelveHourFormatHours < 10 ? '0' + twelveHourFormatHours : twelveHourFormatHours; // add leading zero if needed
	const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // add leading zero if needed

	const formattedDate = `${month}/${day}/${year}`;
	const formattedTime = `${twelveHourFormatHours}:${formattedMinutes} ${amOrPm}`; // combine hours, minutes, and AM/PM designation

	const formattedDateTime = `${formattedDate} ${formattedTime}`;
	return formattedTime;
}