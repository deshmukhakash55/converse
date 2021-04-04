import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CONTACT_COLLECTION } from 'src/converse/contacts/contact-constants';
import { SearchContact } from '../nav-types';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

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
export class ContactSearchService {
	constructor(private angularFirestore: AngularFirestore) {}

	public searchContactsBy(searchText: string): Observable<SearchContact[]> {
		return this.angularFirestore
			.collection(CONTACT_COLLECTION)
			.valueChanges()
			.pipe(
				startWith([{ name: '', email: '', profileImagePath: '' }]),
				map((contactEntities: ContactEntity[]) =>
					this.mapSuitableContactEntitiesToSearchContacts(
						searchText,
						contactEntities
					)
				)
			);
	}

	private mapSuitableContactEntitiesToSearchContacts(
		searchText: string,
		contactEntities: ContactEntity[]
	): SearchContact[] {
		if (!contactEntities) {
			return [{ name: '', email: '', profileImagePath: '' }];
		}
		const filteredSuitableContacts = this.filterSuitableContactsAccordingToSearchText(
			contactEntities,
			searchText
		);
		return filteredSuitableContacts.map(
			this.mapContactEntityToSearchContact
		);
	}

	private filterSuitableContactsAccordingToSearchText(
		contactEntities: ContactEntity[],
		searchText: string
	): ContactEntity[] {
		return contactEntities.filter((contactEntity: ContactEntity) =>
			this.doesContactEntityIncludesSearchText(contactEntity, searchText)
		);
	}

	private doesContactEntityIncludesSearchText(
		contactEntity: ContactEntity,
		searchText: string
	): boolean {
		return (
			this.doesContactEntityNameIncludesSearchText(
				contactEntity,
				searchText
			) ||
			this.doesContactEntityEmailIncludesSearchText(
				contactEntity,
				searchText
			)
		);
	}

	private doesContactEntityNameIncludesSearchText(
		contactEntity: ContactEntity,
		searchText: string
	): boolean {
		const lowercasedTrimmedContactEntityName = contactEntity.name
			.toLowerCase()
			.trim();
		const lowercasedTrimmedSearchText = searchText.toLowerCase().trim();
		return lowercasedTrimmedContactEntityName.includes(
			lowercasedTrimmedSearchText
		);
	}

	private doesContactEntityEmailIncludesSearchText(
		contactEntity: ContactEntity,
		searchText: string
	): boolean {
		const lowercasedTrimmedContactEntityEmail = contactEntity.email
			.toLowerCase()
			.trim();
		const lowercasedTrimmedSearchText = searchText.toLowerCase().trim();
		return lowercasedTrimmedContactEntityEmail.includes(
			lowercasedTrimmedSearchText
		);
	}

	private mapContactEntityToSearchContact(
		contactEntity: ContactEntity
	): SearchContact {
		return {
			name: contactEntity.name,
			email: contactEntity.email,
			profileImagePath: contactEntity.profileImagePath
		};
	}
}
