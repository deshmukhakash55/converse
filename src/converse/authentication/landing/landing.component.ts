import { Subject } from 'rxjs';
import { Component } from '@angular/core';

@Component({
	selector: 'landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
	public selectedTabIndexSubject = new Subject<number>();

	public openRegisterTab(): void {
		this.selectedTabIndexSubject.next(1);
	}

	public openLoginTab(): void {
		this.selectedTabIndexSubject.next(0);
	}
}
