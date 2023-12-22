export function sortByName<T extends { name: string }>(data: T[], orderArray: string[]): T[] {
	return data.sort((a, b) => orderArray.indexOf(a.name) - orderArray.indexOf(b.name));
}
