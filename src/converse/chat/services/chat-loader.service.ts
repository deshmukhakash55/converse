import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CHAT_COLLECTION } from 'src/converse/contacts/contact-constants';
import { Chat } from '../chat-types';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

type ChatEntity = {
	message: string;
	date: {
		seconds: number;
		nanoseconds: number;
	};
	from: string;
	to: string;
};

@Injectable()
export class ChatLoaderService {
	constructor(private angularFirestore: AngularFirestore) {}

	public loadChatsFor(
		senderEmail: string,
		recipientEmail: string
	): Observable<Chat[]> {
		const incomingChatEntities = this.getChatEntitiesFor(
			senderEmail,
			recipientEmail
		);
		const outgoingChatEntities = this.getChatEntitiesFor(
			recipientEmail,
			senderEmail
		);
		return combineLatest([incomingChatEntities, outgoingChatEntities]).pipe(
			map(
				([incomingChats, outgoingChats]: [
					ChatEntity[],
					ChatEntity[]
				]) =>
					this.mapChatEntitiesToChatAndSortByDescendingDate([
						...incomingChats,
						...outgoingChats
					])
			)
		);
	}

	private getChatEntitiesFor(
		from: string,
		to: string
	): Observable<ChatEntity[]> {
		return this.angularFirestore
			.collection<ChatEntity>(CHAT_COLLECTION, (ref) =>
				ref
					.where('from', '==', from)
					.where('to', '==', to)
					.orderBy('date', 'desc')
			)
			.valueChanges();
	}

	private mapChatEntitiesToChatAndSortByDescendingDate(
		chatEntities: ChatEntity[]
	): Chat[] {
		return chatEntities
			.map((chatEntity: ChatEntity) => ({
				message: chatEntity.message,
				date: new Date(
					chatEntity.date.seconds * 1000 +
						chatEntity.date.nanoseconds / 1000000
				),
				from: chatEntity.from,
				to: chatEntity.to
			}))
			.sort((chatOne: Chat, chatTwo: Chat) => {
				if (chatOne.date > chatTwo.date) {
					return -1;
				}
				return 1;
			});
	}
}
