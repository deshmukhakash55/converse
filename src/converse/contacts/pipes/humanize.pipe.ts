import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'humanize'
})
export class HumanizePipe implements PipeTransform {
	public transform(date: Date): string {
		if (!date) {
			return '';
		}
		const now = new Date().getTime();
		const diffMs = now - date.getTime();
		const diffDays = Math.floor(diffMs / 86400000);
		if (!!diffDays) {
			return diffDays <= 2
				? this.decorateWithAgo(diffDays, 'd')
				: this.decorateWithOn(date.getTime() / 1000);
		}
		const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
		if (!!diffHrs) {
			return this.decorateWithAgo(diffHrs, 'h');
		}
		const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
		const postedNow = 'Just now';
		return diffMins ? this.decorateWithAgo(diffMins, 'm') : postedNow;
	}

	private decorateWithAgo(difference: number, unit: string): string {
		return difference + unit + ' ago';
	}

	private decorateWithOn(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString('en-US');
	}
}
