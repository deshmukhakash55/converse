import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CONTACT_COLLECTION } from 'src/converse/contacts/contact-constants';

type ContactEntity = {
	profileImagePath: string;
};

@Injectable()
export class ContactLoaderService {
	constructor(private angularFirestore: AngularFirestore) {}

	public getProfileImagePathFor(email: string): Observable<string> {
		return this.getContactEntityBy(email).pipe(
			map(
				(contactEntities: ContactEntity[]) =>
					contactEntities[0].profileImagePath
			)
		);
	}

	private getContactEntityBy(email: string): Observable<ContactEntity[]> {
		return this.angularFirestore
			.collection<ContactEntity>(CONTACT_COLLECTION, (ref) =>
				ref.where('email', '==', email).limit(1)
			)
			.valueChanges();
	}
}
