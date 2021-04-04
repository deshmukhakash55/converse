import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/converse/authentication/auth-types';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import {
	sendMessageProgress, sendMessageStart
} from '../../store/actions/actions';
import {
	currentBlockConversationId, isSendMessageProgress, isSendMessageSuccess,
	selectedSender
} from '../../store/selectors/selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'chat-input',
	templateUrl: './chat-input.component.html',
	styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {
	public loggedInUser: User;
	public selectedSender: string;
	public message = '';
	public toggled = false;
	public isSendMessageProgress: Observable<boolean>;
	public currentBlockConversationIdSource: Observable<string>;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeLoggedInUserAndSelectedSender();
		this.initializeIsSendMessageProgress();
		this.initializeSendMessageSuccessListener();
		this.initializeCurrentBlockConversationIdSource();
	}

	private initializeLoggedInUserAndSelectedSender(): void {
		this.store.select(loggedInUser).subscribe((user: User) => {
			if (user) {
				this.loggedInUser = user;
				this.store
					.select(selectedSender)
					.subscribe((senderData: { selectedSender: string }) => {
						this.selectedSender = senderData.selectedSender;
					});
			}
		});
	}

	private initializeCurrentBlockConversationIdSource(): void {
		this.currentBlockConversationIdSource = this.store.select(
			currentBlockConversationId
		);
	}

	public sendMessage(event: Event): void {
		event.preventDefault();
		this.store.dispatch(sendMessageProgress());
		this.store.dispatch(
			sendMessageStart({
				from: this.loggedInUser.email,
				to: this.selectedSender,
				message: this.message
			})
		);
	}

	private initializeIsSendMessageProgress(): void {
		this.isSendMessageProgress = this.store
			.select(isSendMessageProgress)
			.pipe(
				map(
					(isSendMessageProgressData: {
						isSendMessageProgress: boolean;
					}) => isSendMessageProgressData.isSendMessageProgress
				)
			);
	}

	private initializeSendMessageSuccessListener(): void {
		this.store
			.select(isSendMessageSuccess)
			.subscribe((successData: { isSendMessageSuccess: boolean }) => {
				if (successData.isSendMessageSuccess) {
					this.message = '';
				}
			});
	}

	public handleSelection(event): void {
		console.log(event.char);
		this.message += event.char;
	}
}
