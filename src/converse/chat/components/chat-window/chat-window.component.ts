import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Chat } from '../../chat-types';
import {
	chats, isLoadChatProgress, selectedSender
} from '../../store/selectors/selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'chat-window',
	templateUrl: './chat-window.component.html',
	styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {
	private loadChatProgressSource: Observable<boolean>;
	private chatsSource: Observable<Chat[]>;
	public loaderObservable: Observable<boolean>;
	private selectedSenderSource: Observable<string>;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.loadChatProgressSource = this.store.select(isLoadChatProgress);
		this.chatsSource = this.store
			.select(chats)
			.pipe(map(({ chats }: { chats: Chat[] }) => [...chats]));
		this.selectedSenderSource = this.store
			.select(selectedSender)
			.pipe(
				map(
					(selectedSenderData: { selectedSender: string }) =>
						selectedSenderData.selectedSender
				)
			);
		this.initializeLoaderObservable();
	}

	private initializeLoaderObservable(): void {
		this.loaderObservable = combineLatest([
			this.loadChatProgressSource,
			this.chatsSource,
			this.selectedSenderSource
		]).pipe(
			mergeMap(
				([isLoadChatProgressStatus, chatList, selectedSenderEmail]: [
					boolean,
					Chat[],
					string
				]) => {
					return of(
						isLoadChatProgressStatus &&
							this.isCurrentChatNotOpened(
								chatList,
								selectedSenderEmail
							)
					);
				}
			)
		);
	}

	private isCurrentChatNotOpened(
		chatList: Chat[],
		selectedSenderEmail: string
	): boolean {
		if (chatList.length === 0) {
			return true;
		}
		return !(
			chatList[0].from === selectedSenderEmail ||
			chatList[0].to === selectedSenderEmail
		);
	}
}
