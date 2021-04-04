import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
			.collection<ContactEntity>('contact', (ref) =>
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
