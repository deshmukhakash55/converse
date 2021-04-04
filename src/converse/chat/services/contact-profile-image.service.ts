import { from, Observable } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { CONTACT_COLLECTION } from 'src/converse/contacts/contact-constants';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

type ContactEntity = {
	id: string;
	name: string;
	email: string;
	profileImagePath: string;
};

@Injectable()
export class ContactProfileImageService {
	constructor(
		private angularFireStorage: AngularFireStorage,
		private angularFirestore: AngularFirestore
	) {}

	public deleteProfileImage(
		profileImagePath: string,
		loggedInEmail: string
	): Observable<void> {
		return this.deleteProfileImageFrom(profileImagePath).pipe(
			mergeMap((_: any) =>
				this.updateContactEntityProfileImagePath(loggedInEmail)
			)
		);
	}

	private deleteProfileImageFrom(profileImagePath: string): Observable<any> {
		return from(
			this.angularFireStorage.storage
				.refFromURL(profileImagePath)
				.delete()
		);
	}

	private updateContactEntityProfileImagePath(
		loggedInEmail: string
	): Observable<void> {
		return this.getContactEntitiesWithIdFor(loggedInEmail).pipe(
			first(),
			map(this.updateProfileImagePathFor)
		);
	}

	private getContactEntitiesWithIdFor(
		email: string
	): Observable<ContactEntity[]> {
		return this.angularFirestore
			.collection<ContactEntity>(CONTACT_COLLECTION, (ref) =>
				ref.where('email', '==', email).limit(1)
			)
			.valueChanges({ idField: 'id' });
	}

	private updateProfileImagePathFor(contactEntities: ContactEntity[]): void {
		this.angularFirestore
			.collection(CONTACT_COLLECTION)
			.doc(contactEntities[0].id)
			.update({
				profileImagePath: ''
			});
	}

	public addProfileImage(file: any, loggedInEmail: string): Observable<void> {
		const fileExtension = file.type === 'image/jpeg' ? '.jpg' : '.png';
		const task = this.angularFireStorage.upload(
			loggedInEmail + fileExtension,
			file
		);
		return from(task).pipe(
			mergeMap((_: any) =>
				this.angularFireStorage
					.ref(loggedInEmail + fileExtension)
					.getDownloadURL()
			),
			mergeMap((url: string) =>
				this.angularFirestore
					.collection(CONTACT_COLLECTION, (ref) =>
						ref.where('email', '==', loggedInEmail).limit(1)
					)
					.valueChanges({ idField: 'id' })
					.pipe(
						first(),
						mergeMap((contactEntities: ContactEntity[]) =>
							from(
								this.angularFirestore
									.collection(CONTACT_COLLECTION)
									.doc(contactEntities[0].id)
									.update({
										profileImagePath: url
									})
							)
						)
					)
			)
		);
	}
}
