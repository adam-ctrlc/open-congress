import type { Group, Person } from '$lib/congress/types';

export function fullName(person: Person): string {
	if (person.full_name && person.full_name.trim().length > 0) {
		return person.full_name;
	}

	const middle = person.middle_name ? `${person.middle_name.charAt(0)}.` : '';
	const parts = [person.name_prefix, person.first_name, middle, person.last_name, person.name_suffix];
	return parts.filter((part) => part && part.trim().length > 0).join(' ');
}

export function initials(person: Person): string {
	const first = person.first_name?.charAt(0) ?? '';
	const last = person.last_name?.charAt(0) ?? '';
	return `${first}${last}`.toUpperCase();
}

export function chamberLabel(group: Group): string {
	switch (group.subtype) {
		case 'senate':
			return 'Senate';
		case 'house':
			return 'House of Representatives';
		default:
			return group.type;
	}
}

export function formatDate(value: string | null): string {
	if (!value) {
		return 'No date';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatNumber(value: number): string {
	return value.toLocaleString('en-PH');
}
