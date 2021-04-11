import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import { User } from 'src/converse/authentication/auth-types';
import {
	sendMessageProgress, sendMessageStart
} from '../../store/actions/actions';
import {
	currentBlockConversationId, isSendMessageProgress, isSendMessageSuccess,
	selectedSender
} from '../../store/selectors/selectors';
import { SendMessageStartPayload } from '../../store/payload-types';

@Component({
	selector: 'chat-input',
	templateUrl: './chat-input.component.html',
	styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit, OnDestroy {
	public loggedInUser: User;
	public selectedSender: string;
	public message = '';
	public toggled = false;
	public isSendMessageProgress: Observable<boolean>;
	public currentBlockConversationIdSource: Observable<string>;
	private loggedInUserAndSelectedSenderSubscription: Subscription;
	private sendMessageSuccessSubscription: Subscription;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeLoggedInUserAndSelectedSenderSubscription();
		this.initializeCurrentBlockConversationIdSource();
		this.initializeIsSendMessageProgress();
		this.initializeSendMessageSuccessSubscription();
	}

	private initializeLoggedInUserAndSelectedSenderSubscription(): void {
		this.loggedInUserAndSelectedSenderSubscription = this.store
			.select(loggedInUser)
			.subscribe((user: User) => {
				if (user) {
					this.loggedInUser = user;
					this.store
						.select(selectedSender)
						.subscribe((selectedSenderData: string) => {
							this.selectedSender = selectedSenderData;
						});
				}
			});
	}

	private initializeCurrentBlockConversationIdSource(): void {
		this.currentBlockConversationIdSource = this.store.select(
			currentBlockConversationId
		);
	}

	private initializeIsSendMessageProgress(): void {
		this.isSendMessageProgress = this.store.select(isSendMessageProgress);
	}

	private initializeSendMessageSuccessSubscription(): void {
		this.sendMessageSuccessSubscription = this.store
			.select(isSendMessageSuccess)
			.subscribe((isSendMessageSuccessStatus: boolean) => {
				if (isSendMessageSuccessStatus) {
					this.message = '';
				}
			});
	}

	public sendMessage(event: Event): void {
		event.preventDefault();
		const sendMessageStartPayload = this.getSendMessageStartPayload();
		this.store.dispatch(sendMessageStart(sendMessageStartPayload));
		this.store.dispatch(sendMessageProgress());
	}

	private getSendMessageStartPayload(): SendMessageStartPayload {
		return {
			from: this.loggedInUser.email,
			to: this.selectedSender,
			message: this.message
		};
	}

	public handleSelection(event: { char: string }): void {
		console.log(event.char);
		this.message += event.char;
	}

	public ngOnDestroy(): void {
		this.loggedInUserAndSelectedSenderSubscription.unsubscribe();
		this.sendMessageSuccessSubscription.unsubscribe();
	}
}
