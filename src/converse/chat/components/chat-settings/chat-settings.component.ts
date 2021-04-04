import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/converse/authentication/auth-types';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import { defaultProfileImagePath } from 'src/converse/converse-constants';
import {
	addProfileImageProgress, addProfileImageStart, deleteProfileImageProgress,
	deleteProfileImageStart
} from '../../store/actions/actions';
import {
	isAddProfileImageProgress, isDeleteProfileImageProgress
} from '../../store/selectors/selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'chat-settings',
	templateUrl: './chat-settings.component.html',
	styleUrls: ['./chat-settings.component.scss']
})
export class ChatSettingsComponent implements OnInit {
	public loggedInUser: User;
	public newImageFile: any;
	public defaultProfileImagePath = defaultProfileImagePath;
	public isAddOrDeleteChatProgress: Observable<boolean>;
	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.store
			.select(loggedInUser)
			.subscribe((user: User) => (this.loggedInUser = user));
		this.initializeIsAddOrDeleteChatProgress();
	}

	private initializeIsAddOrDeleteChatProgress(): void {
		const isAddProgress = this.store.select(isAddProfileImageProgress);
		const isDeleteProgress = this.store.select(
			isDeleteProfileImageProgress
		);
		this.isAddOrDeleteChatProgress = combineLatest([
			isAddProgress,
			isDeleteProgress
		]).pipe(
			map(
				([addProgressStatus, deleteProgressStatus]) =>
					addProgressStatus || deleteProgressStatus
			)
		);
	}

	public uploadNewProfileImage(event: any): void {
		const file = event.target.files[0];
		this.store.dispatch(addProfileImageProgress());
		this.store.dispatch(
			addProfileImageStart({
				file,
				loggedInEmail: this.loggedInUser.email
			})
		);
	}

	public deleteProfileImage(event: Event): void {
		event.preventDefault();
		this.store.dispatch(deleteProfileImageProgress());
		this.store.dispatch(
			deleteProfileImageStart({
				loggedInEmail: this.loggedInUser.email,
				profileImagePath: this.loggedInUser.profileImagePath
			})
		);
	}
}
