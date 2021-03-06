import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import {
	selectedSenderName
} from 'src/converse/contacts/store/selectors/selectors';
import { User } from 'src/converse/authentication/auth-types';
import { defaultProfileImagePath } from 'src/converse/converse-constants';
import {
	contactProfileImagePath, loggedInUserProfileImagePath
} from '../../store/selectors/selectors';
import { Chat, ChatType } from '../../chat-types';

@Component({
	selector: 'chat-message',
	templateUrl: './chat-message.component.html',
	styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit, OnDestroy {
	@Input() public chat: Chat;
	@Input() public chatType: ChatType;
	public profileImagePath: Observable<string>;
	public selectedSenderNameSource: Observable<string>;
	public loggedInUserNameSource: Observable<string>;
	public defaultProfileImagePath = defaultProfileImagePath;
	private profileImagePathSubscription: Subscription;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeProfileImagePathSubscription();
		this.initializeLoggedInUserNameSource();
		this.initializeSelectedSenderNameSource();
	}

	private initializeProfileImagePathSubscription(): void {
		this.profileImagePathSubscription = this.store
			.select(loggedInUser)
			.subscribe(({ email }) => this.setProfileImagePathBy(email));
	}

	private setProfileImagePathBy(email: string): void {
		if (email === this.chat.from) {
			this.profileImagePath = this.store.select(
				loggedInUserProfileImagePath
			);
		} else {
			this.profileImagePath = this.store.select(contactProfileImagePath, {
				email: this.chat.from
			});
		}
	}

	private initializeLoggedInUserNameSource(): void {
		this.loggedInUserNameSource = this.store
			.select(loggedInUser)
			.pipe(map((user: User) => user.name));
	}

	private initializeSelectedSenderNameSource(): void {
		this.selectedSenderNameSource = this.store.select(selectedSenderName);
	}

	public ngOnDestroy(): void {
		this.profileImagePathSubscription.unsubscribe();
	}
}
