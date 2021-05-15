import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
	ChatBlockLoaderService
} from 'src/converse/chat/services/chat-block-loader.service';
import { Contact } from '../contact-types';
import { CHAT_COLLECTION, CONTACT_COLLECTION } from '../contact-constants';

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
		const toChatEntities = this.getToChatEntities(loggedInEmail);
		const fromChatEntities = this.getFromChatEntities(loggedInEmail);
		return combineLatest([toChatEntities, fromChatEntities]).pipe(
			mergeMap(
				([toChatEntityList, fromChatEntityList]: [
					ChatEntity[],
					ChatEntity[]
				]) =>
					this.mapToLatestChatEntities(
						[...toChatEntityList, ...fromChatEntityList],
						loggedInEmail
					)
			),
			mergeMap((chatEntities: ChatEntity[]) =>
				this.mapChatEntitiesToContacts(chatEntities, loggedInEmail)
			),
			mergeMap((contacts: Contact[]) =>
				this.updateContactsBlockChatId(contacts, loggedInEmail)
			),
			map(this.sortContactsByDescendingDate)
		);
	}

	private getToChatEntities(email: string): Observable<ChatEntity[]> {
		return this.angularFirestore
			.collection<ChatEntity>(CHAT_COLLECTION, (ref) =>
				ref.where('to', '==', email).orderBy('date', 'desc')
			)
			.valueChanges();
	}

	private getFromChatEntities(email: string): Observable<ChatEntity[]> {
		return this.angularFirestore
			.collection<ChatEntity>(CHAT_COLLECTION, (ref) =>
				ref.where('from', '==', email).orderBy('date', 'desc')
			)
			.valueChanges();
	}

	private mapToLatestChatEntities(
		chatEntities: ChatEntity[],
		loggedInEmail: string
	): Observable<ChatEntity[]> {
		const contacts = this.getContactSetFromChatEntities(
			chatEntities,
			loggedInEmail
		);
		return this.getLatestChatEntityForContacts(contacts, loggedInEmail);
	}

	private getContactSetFromChatEntities(
		chatEntities: ChatEntity[],
		loggedInEmail: string
	): string[] {
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
		return contacts;
	}

	private getLatestChatEntityForContacts(
		contacts: string[],
		loggedInEmail: string
	): Observable<ChatEntity[]> {
		if (contacts.length === 0) {
			return of([]);
		}
		return combineLatest(
			contacts.map((contact: string) =>
				this.getLatestChatEntityForContact(contact, loggedInEmail)
			)
		);
	}

	private getLatestChatEntityForContact(
		contact: string,
		loggedInEmail: string
	): Observable<ChatEntity> {
		const toContactChats = this.getContactChats(loggedInEmail, contact);
		const fromContactChats = this.getContactChats(contact, loggedInEmail);
		return combineLatest([toContactChats, fromContactChats]).pipe(
			map(this.getLatestChatEntity)
		);
	}

	private getContactChats(
		from: string,
		to: string
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

	private getLatestChatEntity([
		toContactChatEntities,
		fromContactChatEntities
	]: [ChatEntity[], ChatEntity[]]): ChatEntity {
		if (toContactChatEntities.length === 0) {
			return fromContactChatEntities[0];
		} else if (fromContactChatEntities.length === 0) {
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

	private updateContactsBlockChatId(
		contacts: Contact[],
		loggedInEmail: string
	): Observable<Contact[]> {
		if (contacts.length === 0) {
			return of([]);
		}
		return combineLatest(
			contacts.map((contact: Contact) =>
				this.updateContactBlockChatId(contact, loggedInEmail)
			)
		);
	}

	private mapChatEntitiesToContacts(
		chatEntities: ChatEntity[],
		loggedInEmail: string
	): Observable<Contact[]> {
		if (chatEntities.length === 0) {
			return of([]);
		}
		return combineLatest(
			chatEntities.map((chatEntity: ChatEntity) =>
				this.mapChatEntityToContact(chatEntity, loggedInEmail)
			)
		);
	}

	private mapChatEntityToContact(
		chatEntity: ChatEntity,
		loggedInEmail: string
	): Observable<Contact> {
		const chatType =
			chatEntity.from === loggedInEmail ? 'outgoing' : 'incoming';
		return this.angularFirestore
			.collection(CONTACT_COLLECTION, (ref) =>
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
					profileImagePath: contactEntity[0].profileImagePath,
					latestMessage: chatEntity.message,
					latestContactDate: new Date(
						chatEntity.date.seconds * 1000 +
							chatEntity.date.nanoseconds / 1000000
					),
					blockChatId: null
				}))
			);
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

	private sortContactsByDescendingDate(contacts: Contact[]): Contact[] {
		return [...contacts].sort(
			(contactOne: Contact, contactTwo: Contact) => {
				if (
					contactOne.latestContactDate > contactTwo.latestContactDate
				) {
					return -1;
				}
				return 1;
			}
		);
	}
}
