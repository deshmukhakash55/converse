import { checkLoginStatus } from './authentication/store/actions/actions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'converse',
	templateUrl: './converse.component.html',
	styleUrls: ['./converse.component.scss']
})
export class ConverseComponent implements OnInit {
	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.store.dispatch(checkLoginStatus());
	}
}
