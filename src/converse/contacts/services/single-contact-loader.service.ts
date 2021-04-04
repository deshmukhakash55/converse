import { combineLatest, Observable } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { SearchContact } from '../../nav/nav-types';
import { CHAT_COLLECTION } from '../contact-constants';
import { Contact } from '../contact-types';
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
	): Observable<{ contact: Contact; loggedInEmail: string }> {
		const toChatEntities = this.getLatestChatEntitites(
			searchContact.email,
			loggedInEmail
		);
		const fromChatEntities = this.getLatestChatEntitites(
			loggedInEmail,
			searchContact.email
		);
		return combineLatest([toChatEntities, fromChatEntities]).pipe(
			mergeMap(
				([toChatEntityList, fromChatEntityList]: [
					ChatEntity[],
					ChatEntity[]
				]) =>
					this.getLatestChatEntityMappedToContact(
						searchContact,
						toChatEntityList,
						fromChatEntityList
					)
			),
			mergeMap((contact: Contact) =>
				this.updateContactBlockChatId(contact, loggedInEmail)
			),
			first(),
			map((contact: Contact) => ({ contact, loggedInEmail }))
		);
	}

	private getLatestChatEntitites(
		to: string,
		from: string
	): Observable<ChatEntity[]> {
		return this.angularFirestore
			.collection<ChatEntity>(CHAT_COLLECTION, (ref) =>
				ref
					.where('to', '==', to)
					.where('from', '==', from)
					.orderBy('date', 'desc')
					.limit(1)
			)
			.valueChanges();
	}

	private getLatestChatEntityMappedToContact(
		searchContact: SearchContact,
		toChatEntities: ChatEntity[],
		fromChatEntities: ChatEntity[]
	): Contact[] {
		if (toChatEntities.length === 0 && fromChatEntities.length === 0) {
			return [
				{
					...searchContact,
					latestContactDate: null,
					latestMessage: '',
					chatType: 'none',
					blockChatId: null
				}
			];
		}
		if (toChatEntities.length === 0 && fromChatEntities.length !== 0) {
			return [
				{
					...searchContact,
					latestContactDate: new Date(
						fromChatEntities[0].date.seconds * 1000 +
							fromChatEntities[0].date.nanoseconds / 1000000
					),
					latestMessage: fromChatEntities[0].message,
					chatType: 'incoming',
					blockChatId: null
				}
			];
		}
		if (toChatEntities.length !== 0 && fromChatEntities.length === 0) {
			return [
				{
					...searchContact,
					latestContactDate: new Date(
						toChatEntities[0].date.seconds * 1000 +
							toChatEntities[0].date.nanoseconds / 1000000
					),
					latestMessage: toChatEntities[0].message,
					chatType: 'outgoing',
					blockChatId: null
				}
			];
		}
		if (toChatEntities[0].date.seconds > fromChatEntities[0].date.seconds) {
			return [
				{
					...searchContact,
					latestContactDate: new Date(
						toChatEntities[0].date.seconds * 1000 +
							toChatEntities[0].date.nanoseconds / 1000000
					),
					latestMessage: toChatEntities[0].message,
					chatType: 'outgoing',
					blockChatId: null
				}
			];
		} else {
			return [
				{
					...searchContact,
					latestContactDate: new Date(
						fromChatEntities[0].date.seconds * 1000 +
							fromChatEntities[0].date.nanoseconds / 1000000
					),
					latestMessage: fromChatEntities[0].message,
					chatType: 'incoming',
					blockChatId: null
				}
			];
		}
	}

	private updateContactBlockChatId(
		contact: Contact,
		loggedInEmail: string
	): Observable<Contact> {
		return this.chatBlockLoaderService
			.isChatBlockedFor(loggedInEmail, contact.email)
			.pipe(
				map((blockChatId: string) => ({
					...contact,
					blockChatId
				}))
			);
	}
}
