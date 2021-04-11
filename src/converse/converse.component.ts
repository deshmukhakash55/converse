import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { checkLoginStatus } from './authentication/store/actions/actions';

@Component({
	selector: 'converse',
	template: '<router-outlet></router-outlet>'
})
export class ConverseComponent implements OnInit {
	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.store.dispatch(checkLoginStatus());
	}
}
