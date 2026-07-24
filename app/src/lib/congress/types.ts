export interface Pagination {
	total: number;
	limit: number;
	offset?: number;
	has_more: boolean;
	next_cursor?: string | null;
}

export interface Envelope<T> {
	success: boolean;
	data: T;
	pagination?: Pagination;
	error?: { code: string; message: string };
}

export interface Person {
	id: string;
	first_name: string;
	last_name: string;
	middle_name: string | null;
	name_prefix: string | null;
	name_suffix: string | null;
	full_name: string | null;
	professional_designations: string[] | null;
	senate_website_keys: string[] | null;
	congress_website_primary_keys: number[] | null;
	congress_website_author_keys: string[] | null;
	aliases: string[] | null;
}

export interface Group {
	id: string;
	name: string;
	type: string;
	subtype: string | null;
	congress: number | null;
}

export interface DocumentSummary {
	id: string;
	type: string;
	subtype: string | null;
	name: string;
	bill_number: number | null;
	congress: number | null;
	title: string | null;
	long_title: string | null;
	congress_website_title: string | null;
	congress_website_abstract?: string | null;
	date_filed: string | null;
	scope: string | null;
	subjects: string[];
	authors_raw: string | null;
	senate_website_permalink: string | null;
	download_url_sources?: string[];
	authors?: Person[];
}

export interface Congress {
	id: string;
	congress_number: number;
	congress_website_key: number | null;
	name: string;
	ordinal: string;
	start_date: string | null;
	end_date: string | null;
	start_year: number | null;
	end_year: number | null;
	year_range: string | null;
	total_senators?: number;
	total_representatives?: number;
	total_committees?: number;
}

export interface CongressBreakdown {
	congress: number;
	total: number;
	house_bills: number;
	senate_bills: number;
}

export interface Stats {
	total_bills: number;
	total_house_bills: number;
	total_senate_bills: number;
	total_congresses: number;
	total_people: number;
	total_committees: number;
	bills_by_congress: CongressBreakdown[];
}
