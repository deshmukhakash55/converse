import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/converse/authentication/auth-types';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import {
	selectedSenderName
} from 'src/converse/contacts/store/selectors/selectors';
import { defaultProfileImagePath } from 'src/converse/converse-constants';
import { Chat, ChatType } from '../../chat-types';
import {
	contactProfileImagePath, loggedInUserProfileImagePath
} from '../../store/selectors/selectors';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'chat-message',
	templateUrl: './chat-message.component.html',
	styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
	@Input() public chat: Chat;
	@Input() public chatType: ChatType;
	public profileImagePath: Observable<string>;
	public selectedSenderNameSource: Observable<string>;
	public loggedInUserNameSource: Observable<string>;
	public defaultProfileImagePath = defaultProfileImagePath;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.store.select(loggedInUser).subscribe(({ email }) => {
			if (email === this.chat.from) {
				this.profileImagePath = this.store.select(
					loggedInUserProfileImagePath
				);
			} else {
				this.profileImagePath = this.store.select(
					contactProfileImagePath,
					{ email: this.chat.from }
				);
			}
		});
		this.initializeLoggedInUserNameSource();
		this.initializeSelectedSenderNameSource();
	}

	private initializeLoggedInUserNameSource(): void {
		this.loggedInUserNameSource = this.store
			.select(loggedInUser)
			.pipe(map((user: User) => user.name));
	}

	private initializeSelectedSenderNameSource(): void {
		this.selectedSenderNameSource = this.store.select(selectedSenderName);
	}
}
