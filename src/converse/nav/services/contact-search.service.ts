import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
			.collection('contact')
			.valueChanges()
			.pipe(
				startWith([{ name: '', email: '' }]),
				map((contactEntities: ContactEntity[]) => {
					if (!contactEntities) {
						return [{ name: '', email: '', profileImagePath: '' }];
					}
					return contactEntities
						.filter(
							(contactEntity: ContactEntity) =>
								contactEntity.name
									.toLowerCase()
									.trim()
									.indexOf(
										searchText.toLowerCase().trim()
									) !== -1 ||
								contactEntity.email
									.toLowerCase()
									.trim()
									.indexOf(
										searchText.toLowerCase().trim()
									) !== -1
						)
						.map((contactEntity: ContactEntity) => ({
							name: contactEntity.name,
							email: contactEntity.email,
							profileImagePath: contactEntity.profileImagePath
						}));
				})
			);
	}
}
