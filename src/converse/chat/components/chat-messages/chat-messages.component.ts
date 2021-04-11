import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
	AfterViewInit, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import { User } from 'src/converse/authentication/auth-types';
import { chats, isSendMessageSuccess } from '../../store/selectors/selectors';
import { Chat, ChatType } from '../../chat-types';

@Component({
	selector: 'chat-messages',
	templateUrl: './chat-messages.component.html',
	styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('virtualScroll', { static: true })
	public virtualScrollViewport: CdkVirtualScrollViewport;
	public chatsSource: Observable<Chat[]>;
	public loggedInUser: User;
	private loggedInUserAndChatsSourceSubscription: Subscription;
	private sendMessageSuccessSubscription: Subscription;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeLoggedInUserAndChatsSourceSubscription();
		this.initializeSendMessageSuccessSubscription();
	}

	private initializeLoggedInUserAndChatsSourceSubscription(): void {
		this.loggedInUserAndChatsSourceSubscription = this.store
			.select(loggedInUser)
			.subscribe((user: User) => {
				if (user) {
					this.loggedInUser = user;
					this.initializeChatSource();
				}
			});
	}

	private initializeChatSource(): void {
		this.chatsSource = this.store.select(chats).pipe(
			map((chatList: Chat[]) => [...chatList]),
			tap(() => this.scrollMessagesWindowToBottom())
		);
	}

	private initializeSendMessageSuccessSubscription(): void {
		this.sendMessageSuccessSubscription = this.store
			.select(isSendMessageSuccess)
			.subscribe((isSendMessageSuccessStatus: boolean) => {
				if (isSendMessageSuccessStatus) {
					this.scrollMessagesWindowToBottom();
				}
			});
	}

	public ngAfterViewInit(): void {
		this.scrollMessagesWindowToBottom();
	}

	private scrollMessagesWindowToBottom(): void {
		setTimeout(
			() =>
				this.virtualScrollViewport.scrollTo({
					bottom: 0,
					behavior: 'auto'
				}),
			0
		);
	}

	public getChatTypeFor(chat: Chat): ChatType {
		if (chat.from === this.loggedInUser.email) {
			return 'outgoing';
		}
		return 'incoming';
	}

	public ngOnDestroy(): void {
		this.loggedInUserAndChatsSourceSubscription.unsubscribe();
		this.sendMessageSuccessSubscription.unsubscribe();
	}
}
