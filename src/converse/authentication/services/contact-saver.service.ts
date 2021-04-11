import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CONTACT_COLLECTION } from 'src/converse/contacts/contact-constants';
import { ContactPayload } from '../store/payload-types';

type ContactEntity = {
	name: string;
};

@Injectable()
export class ContactSaverService {
	constructor(private angularFirestore: AngularFirestore) {}

	public async addContact({ contact }: ContactPayload): Promise<void> {
		return new Promise((resolve, reject) => {
			this.getContactEntitiesBy(contact.email).subscribe(
				(contacts: ContactEntity[]) => {
					if (contacts.length === 0) {
						this.angularFirestore
							.collection(CONTACT_COLLECTION)
							.add(contact)
							.then(() => resolve())
							.catch(() => reject());
					}
				}
			);
		});
	}

	private getContactEntitiesBy(email: string): Observable<ContactEntity[]> {
		return this.angularFirestore
			.collection<ContactEntity>(CONTACT_COLLECTION, (ref) =>
				ref.where('email', '==', email)
			)
			.valueChanges();
	}
}
