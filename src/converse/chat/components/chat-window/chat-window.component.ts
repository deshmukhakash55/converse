import { combineLatest, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
	isLoadContactsProgress
} from 'src/converse/contacts/store/selectors/selectors';
import {
	chats, isLoadChatProgress, isSendMessageProgress, selectedSender
} from '../../store/selectors/selectors';
import { Chat } from '../../chat-types';

@Component({
	selector: 'chat-window',
	templateUrl: './chat-window.component.html',
	styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {
	public loaderObservable: Observable<boolean>;
	private loadChatProgressSource: Observable<boolean>;
	private chatsSource: Observable<Chat[]>;
	private isSendMessageProgressSource: Observable<boolean>;
	private selectedSenderSource: Observable<string>;
	private isLoadContactsProgressSource: Observable<boolean>;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeLoadChatProgressSource();
		this.initializeChatsSource();
		this.initializeSelectedSenderSource();
		this.initializeIsLoadContactsProgress();
		this.initializeIsSendMessageProgress();
		this.initializeLoaderObservable();
	}

	private initializeLoadChatProgressSource(): void {
		this.loadChatProgressSource = this.store.select(isLoadChatProgress);
	}

	private initializeChatsSource(): void {
		this.chatsSource = this.store.select(chats);
	}

	private initializeSelectedSenderSource(): void {
		this.selectedSenderSource = this.store.select(selectedSender);
	}

	private initializeIsLoadContactsProgress(): void {
		this.isLoadContactsProgressSource = this.store.select(
			isLoadContactsProgress
		);
	}

	private initializeIsSendMessageProgress(): void {
		this.isSendMessageProgressSource = this.store.select(
			isSendMessageProgress
		);
	}

	private initializeLoaderObservable(): void {
		this.loaderObservable = combineLatest([
			this.loadChatProgressSource,
			this.chatsSource,
			this.selectedSenderSource,
			this.isLoadContactsProgressSource,
			this.isSendMessageProgressSource
		]).pipe(
			mergeMap(
				([
					isLoadChatProgressStatus,
					chatList,
					selectedSenderEmail,
					isLoadContactsProgressStatus,
					isSendMessageProgressStatus
				]: [boolean, Chat[], string, boolean, boolean]) => {
					return of(
						this.shouldShowLoader(
							chatList,
							selectedSenderEmail,
							isLoadChatProgressStatus,
							isLoadContactsProgressStatus,
							isSendMessageProgressStatus
						)
					);
				}
			)
		);
	}

	private shouldShowLoader(
		chatList: Chat[],
		selectedSenderEmail: string,
		isLoadChatProgressStatus: boolean,
		isLoadContactsProgressStatus: boolean,
		isSendMessageProgressStatus: boolean
	): boolean {
		if (isSendMessageProgressStatus) {
			return false;
		}
		if (isLoadChatProgressStatus || isLoadContactsProgressStatus) {
			return true;
		}
		if (!selectedSenderEmail) {
			return true;
		}
		if (chatList.length === 0 && !isLoadChatProgressStatus) {
			return false;
		}
		return !(
			chatList[0].from === selectedSenderEmail ||
			chatList[0].to === selectedSenderEmail
		);
	}
}
