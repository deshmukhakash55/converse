import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/converse/authentication/auth-types';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import { Chat, ChatType } from '../../chat-types';
import { chats, isSendMessageSuccess } from '../../store/selectors/selectors';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'chat-messages',
	templateUrl: './chat-messages.component.html',
	styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit, AfterViewInit {
	@ViewChild('virtualScroll', { static: true })
	public virtualScrollViewport: CdkVirtualScrollViewport;
	public chatsSource: Observable<Chat[]>;
	public loggedInUser: User;
	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeLoggedInUserAndChatsSource();
		this.initializeSendMessageSuccessListener();
	}

	private initializeLoggedInUserAndChatsSource(): void {
		this.store.select(loggedInUser).subscribe((user: User) => {
			if (user) {
				this.loggedInUser = user;
				this.chatsSource = this.store.select(chats).pipe(
					map((chatsData: { chats: Chat[] }) => [...chatsData.chats]),
					tap(() => this.scrollMessagesWindowToBottom())
				);
			}
		});
	}

	private initializeSendMessageSuccessListener(): void {
		this.store
			.select(isSendMessageSuccess)
			.subscribe((successData: { isSendMessageSuccess: boolean }) => {
				if (successData.isSendMessageSuccess) {
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
}
