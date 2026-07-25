export type Theme = 'system' | 'light' | 'dark';

export const STORAGE_KEY = 'theme';

export function resolve(theme: Theme): 'light' | 'dark' {
	switch (theme) {
		case 'light':
		case 'dark':
			return theme;
		default:
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
}

export function apply(theme: Theme): void {
	document.documentElement.classList.toggle('dark', resolve(theme) === 'dark');
}

export function read(): Theme {
	const stored = localStorage.getItem(STORAGE_KEY);
	switch (stored) {
		case 'light':
		case 'dark':
			return stored;
		default:
			return 'system';
	}
}

export function save(theme: Theme): void {
	switch (theme) {
		case 'system':
			localStorage.removeItem(STORAGE_KEY);
			break;
		default:
			localStorage.setItem(STORAGE_KEY, theme);
	}
}
