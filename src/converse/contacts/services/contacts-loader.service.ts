import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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

type ContactEntity = {
	name: string;
	email: string;
	profileImagePath: string;
};

@Injectable()
export class ContactsLoaderService {
	constructor(
		private angularFirestore: AngularFirestore,
		private chatBlockLoaderService: ChatBlockLoaderService
	) {}

	public loadContactsFor(loggedInEmail: string): Observable<Contact[]> {
		const toCollection = this.angularFirestore
			.collection('chat', (ref) =>
				ref.where('to', '==', loggedInEmail).orderBy('date', 'desc')
			)
			.valueChanges();
		const fromCollection = this.angularFirestore
			.collection('chat', (ref) =>
				ref.where('from', '==', loggedInEmail).orderBy('date', 'desc')
			)
			.valueChanges();
		return combineLatest([toCollection, fromCollection]).pipe(
			mergeMap(([toChatEntities, fromChatEntities]) => {
				const chatEntities = [...toChatEntities, ...fromChatEntities];
				const contacts = [];
				chatEntities.forEach((chatEntity: ChatEntity) => {
					if (
						chatEntity.to === loggedInEmail &&
						!contacts.includes(chatEntity.from)
					) {
						contacts.push(chatEntity.from);
					} else if (
						chatEntity.from === loggedInEmail &&
						!contacts.includes(chatEntity.to)
					) {
						contacts.push(chatEntity.to);
					}
				});
				return combineLatest(
					contacts.map((contact: string) => {
						const toContactChats = this.angularFirestore
							.collection('chat', (ref) =>
								ref
									.where('to', '==', contact)
									.where('from', '==', loggedInEmail)
									.orderBy('date', 'desc')
									.limit(1)
							)
							.valueChanges();
						const fromContactChats = this.angularFirestore
							.collection('chat', (ref) =>
								ref
									.where('from', '==', contact)
									.where('to', '==', loggedInEmail)
									.orderBy('date', 'desc')
									.limit(1)
							)
							.valueChanges();
						return combineLatest([
							toContactChats,
							fromContactChats
						]).pipe(
							map(
								([
									toContactChatEntities,
									fromContactChatEntities
								]: [ChatEntity[], ChatEntity[]]) => {
									if (toContactChatEntities.length === 0) {
										return fromContactChatEntities[0];
									} else if (
										fromContactChatEntities.length === 0
									) {
										return toContactChatEntities[0];
									}
									if (
										toContactChatEntities[0].date.seconds >
										fromContactChatEntities[0].date.seconds
									) {
										return toContactChatEntities[0];
									} else {
										return fromContactChatEntities[0];
									}
								}
							)
						);
					})
				);
			}),
			mergeMap((chatEntities: ChatEntity[]) =>
				combineLatest(
					chatEntities.map((chatEntity: ChatEntity) => {
						const chatType =
							chatEntity.from === loggedInEmail
								? 'outgoing'
								: 'incoming';
						return this.angularFirestore
							.collection('contact', (ref) =>
								ref
									.where(
										'email',
										'==',
										chatType === 'incoming'
											? chatEntity.from
											: chatEntity.to
									)
									.limit(1)
							)
							.valueChanges()
							.pipe(
								map((contactEntity: ContactEntity[]) => ({
									email: contactEntity[0].email,
									name: contactEntity[0].name,
									chatType,
									profileImagePath:
										contactEntity[0].profileImagePath,
									latestMessage: chatEntity.message,
									latestContactDate: new Date(
										chatEntity.date.seconds * 1000 +
											chatEntity.date.nanoseconds /
												1000000
									)
								}))
							);
					})
				)
			),
			mergeMap((contacts: Contact[]) =>
				combineLatest(
					contacts.map((contact: Contact) =>
						this.chatBlockLoaderService
							.isChatBlockedFor(loggedInEmail, contact.email)
							.pipe(
								map((blockChatId: string) => ({
									...contact,
									blockChatId
								}))
							)
					)
				)
			),
			map((contacts: Contact[]) =>
				[...contacts].sort(
					(contactOne: Contact, contactTwo: Contact) => {
						if (
							contactOne.latestContactDate >
							contactTwo.latestContactDate
						) {
							return -1;
						}
						return 1;
					}
				)
			)
		);
	}
}
