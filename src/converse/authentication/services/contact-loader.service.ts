import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CONTACT_COLLECTION } from 'src/converse/contacts/contact-constants';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

type ContactEntity = {
	profileImagePath: string;
};

@Injectable()
export class ContactLoaderService {
	constructor(private angularFirestore: AngularFirestore) {}

	public getProfileImagePathFor(email: string): Observable<string> {
		return this.angularFirestore
			.collection<ContactEntity>(CONTACT_COLLECTION, (ref) =>
				ref.where('email', '==', email)
			)
			.valueChanges()
			.pipe(
				map(
					(contactEntities: ContactEntity[]) =>
						contactEntities[0].profileImagePath
				)
			);
	}
}
