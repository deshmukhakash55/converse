import { Subject, Subscription } from 'rxjs';
import { takeLast } from 'rxjs/operators';
import { isLoginSuccess } from '../store/selectors/selectors';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
	public selectedTabIndexSubject = new Subject<number>();
	private isLoginSuccessSubscription: Subscription;

	constructor(private store: Store, private router: Router) {}

	public openRegisterTab(): void {
		this.selectedTabIndexSubject.next(1);
	}

	public openLoginTab(): void {
		this.selectedTabIndexSubject.next(0);
	}

	public ngOnInit(): void {
		this.isLoginSuccessSubscription = this.store
			.select(isLoginSuccess)
			.subscribe((loginStatus: boolean) => {
				if (loginStatus) {
					this.router.navigate(['chat']);
				}
			});
	}

	public ngOnDestroy(): void {
		this.isLoginSuccessSubscription.unsubscribe();
	}
}
