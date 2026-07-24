export interface SortOption {
	value: string;
	label: string;
	sort?: string;
	dir?: string;
}

export const documentSorts: SortOption[] = [
	{ value: '', label: 'Default order' },
	{ value: 'date_desc', label: 'Date filed (newest)', sort: 'date_filed', dir: 'desc' },
	{ value: 'date_asc', label: 'Date filed (oldest)', sort: 'date_filed', dir: 'asc' },
	{ value: 'num_desc', label: 'Bill no. (high to low)', sort: 'bill_number', dir: 'desc' },
	{ value: 'num_asc', label: 'Bill no. (low to high)', sort: 'bill_number', dir: 'asc' },
	{ value: 'title_asc', label: 'Title A to Z', sort: 'title', dir: 'asc' },
	{ value: 'title_desc', label: 'Title Z to A', sort: 'title', dir: 'desc' }
];

export const peopleSorts: SortOption[] = [
	{ value: '', label: 'Default order' },
	{ value: 'name_asc', label: 'Name A to Z', sort: 'last_name', dir: 'asc' },
	{ value: 'name_desc', label: 'Name Z to A', sort: 'last_name', dir: 'desc' }
];

export function resolveSort(options: SortOption[], value: string): SortOption {
	return options.find((option) => option.value === value) ?? options[0];
}
