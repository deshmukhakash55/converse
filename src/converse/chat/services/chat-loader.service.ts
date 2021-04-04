import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
		const incomingChats = this.angularFirestore
			.collection('chat', (ref) =>
				ref
					.where('from', '==', senderEmail)
					.where('to', '==', recipientEmail)
					.orderBy('date', 'desc')
			)
			.valueChanges();
		const outgoingChats = this.angularFirestore
			.collection('chat', (ref) =>
				ref
					.where('to', '==', senderEmail)
					.where('from', '==', recipientEmail)
					.orderBy('date', 'desc')
			)
			.valueChanges();
		return combineLatest([incomingChats, outgoingChats]).pipe(
			map(
				([incomingChatEntities, outgoingChatEntities]: [
					ChatEntity[],
					ChatEntity[]
				]) => {
					return [...incomingChatEntities, ...outgoingChatEntities]
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
			)
		);
	}
}
