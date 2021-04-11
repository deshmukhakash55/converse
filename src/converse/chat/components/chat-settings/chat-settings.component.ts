import { combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import { User } from 'src/converse/authentication/auth-types';
import { defaultProfileImagePath } from 'src/converse/converse-constants';
import {
	addProfileImageProgress, addProfileImageStart, deleteProfileImageProgress,
	deleteProfileImageStart
} from '../../store/actions/actions';
import {
	isAddProfileImageProgress, isDeleteProfileImageProgress
} from '../../store/selectors/selectors';
import {
	AddProfileImageStartPayload, DeleteProfileImageStartPayload
} from '../../store/payload-types';

@Component({
	selector: 'chat-settings',
	templateUrl: './chat-settings.component.html',
	styleUrls: ['./chat-settings.component.scss']
})
export class ChatSettingsComponent implements OnInit, OnDestroy {
	public loggedInUser: User;
	public newImageFile: any;
	public defaultProfileImagePath = defaultProfileImagePath;
	public isAddOrDeleteChatProgress: Observable<boolean>;
	private loggedInUserSubscription: Subscription;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeLoggedInUserSubscription();
		this.initializeIsAddOrDeleteChatProgress();
	}

	private initializeLoggedInUserSubscription(): void {
		this.loggedInUserSubscription = this.store
			.select(loggedInUser)
			.subscribe((user: User) => (this.loggedInUser = user));
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
		const addProfileImageStartPayload = this.getAddProfileImageStartPayload(
			file
		);
		this.store.dispatch(addProfileImageStart(addProfileImageStartPayload));
		this.store.dispatch(addProfileImageProgress());
	}

	private getAddProfileImageStartPayload(
		file: any
	): AddProfileImageStartPayload {
		return {
			file,
			loggedInEmail: this.loggedInUser.email
		};
	}

	public deleteProfileImage(event: Event): void {
		event.preventDefault();
		const deleteProfileImageStartPayload = this.getDeleteProfileImageStartPayload();
		this.store.dispatch(deleteProfileImageProgress());
		this.store.dispatch(
			deleteProfileImageStart(deleteProfileImageStartPayload)
		);
	}

	private getDeleteProfileImageStartPayload(): DeleteProfileImageStartPayload {
		return {
			loggedInEmail: this.loggedInUser.email,
			profileImagePath: this.loggedInUser.profileImagePath
		};
	}

	public ngOnDestroy(): void {
		this.loggedInUserSubscription.unsubscribe();
	}
}
