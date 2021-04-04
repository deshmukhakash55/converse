import { CONTACT_COLLECTION } from 'src/converse/contacts/contact-constants';
import { ContactPayload } from '../store/payload-types';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class ContactSaverService {
	constructor(private firestore: AngularFirestore) {}

	public async addContact({ contact }: ContactPayload): Promise<void> {
		return new Promise((resolve, reject) => {
			this.firestore
				.collection(CONTACT_COLLECTION, (ref) =>
					ref.where('email', '==', contact.email)
				)
				.valueChanges()
				.subscribe((contacts: any[]) => {
					if (contacts.length === 0) {
						this.firestore
							.collection(CONTACT_COLLECTION)
							.add(contact)
							.then(() => resolve())
							.catch(() => reject());
					}
				});
		});
	}
}
