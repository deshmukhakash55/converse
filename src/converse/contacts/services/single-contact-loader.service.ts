import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SearchContact } from '../../nav/nav-types';
import { Contact } from '../store/payload-types';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
	ChatBlockLoaderService
} from 'src/converse/chat/services/chat-block-loader.service';

type ChatEntity = {
	from: string;
	to: string;
	message: string;
	date: {
		seconds: number;
		nanoseconds: number;
	};
};

@Injectable()
export class SingleContactLoaderService {
	constructor(
		private angularFirestore: AngularFirestore,
		private chatBlockLoaderService: ChatBlockLoaderService
	) {}
	public loadSingleContactDetailsFor(
		searchContact: SearchContact,
		loggedInEmail: string
	): Observable<Contact> {
		const toCollection = this.angularFirestore
			.collection<ChatEntity>('chat', (ref) =>
				ref
					.where('to', '==', searchContact.email)
					.where('from', '==', loggedInEmail)
					.orderBy('date', 'desc')
					.limit(1)
			)
			.valueChanges();
		const fromCollection = this.angularFirestore
			.collection<ChatEntity>('chat', (ref) =>
				ref
					.where('from', '==', searchContact.email)
					.where('to', '==', loggedInEmail)
					.orderBy('date', 'desc')
					.limit(1)
			)
			.valueChanges();
		return combineLatest([toCollection, fromCollection]).pipe(
			mergeMap(
				([toChatEntities, fromChatEntities]: [
					ChatEntity[],
					ChatEntity[]
				]) => {
					if (
						toChatEntities.length === 0 &&
						fromChatEntities.length === 0
					) {
						return [
							{
								...searchContact,
								latestContactDate: null,
								latestMessage: '',
								chatType: 'none'
							}
						];
					}
					if (
						toChatEntities.length === 0 &&
						fromChatEntities.length !== 0
					) {
						return [
							{
								...searchContact,
								latestContactDate: new Date(
									fromChatEntities[0].date.seconds * 1000 +
										fromChatEntities[0].date.nanoseconds /
											1000000
								),
								latestMessage: fromChatEntities[0].message,
								chatType: 'incoming'
							}
						];
					}
					if (
						toChatEntities.length !== 0 &&
						fromChatEntities.length === 0
					) {
						return [
							{
								...searchContact,
								latestContactDate: new Date(
									toChatEntities[0].date.seconds * 1000 +
										toChatEntities[0].date.nanoseconds /
											1000000
								),
								latestMessage: toChatEntities[0].message,
								chatType: 'outgoing'
							}
						];
					}
					if (
						toChatEntities[0].date.seconds >
						fromChatEntities[0].date.seconds
					) {
						return [
							{
								...searchContact,
								latestContactDate: new Date(
									toChatEntities[0].date.seconds * 1000 +
										toChatEntities[0].date.nanoseconds /
											1000000
								),
								latestMessage: toChatEntities[0].message,
								chatType: 'outgoing'
							}
						];
					} else {
						return [
							{
								...searchContact,
								latestContactDate: new Date(
									fromChatEntities[0].date.seconds * 1000 +
										fromChatEntities[0].date.nanoseconds /
											1000000
								),
								latestMessage: fromChatEntities[0].message,
								chatType: 'incoming'
							}
						];
					}
				}
			),
			mergeMap((contact: Contact) =>
				this.chatBlockLoaderService
					.isChatBlockedFor(loggedInEmail, contact.email)
					.pipe(
						map((blockChatId: string) => ({
							...contact,
							blockChatId
						}))
					)
			)
		);
	}
}
