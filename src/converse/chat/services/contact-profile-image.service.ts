import { from, Observable } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
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
		return from(
			this.angularFireStorage.storage
				.refFromURL(profileImagePath)
				.delete()
		).pipe(
			mergeMap((response: any) => {
				return this.angularFirestore
					.collection('contact', (ref) =>
						ref.where('email', '==', loggedInEmail).limit(1)
					)
					.valueChanges({ idField: 'id' })
					.pipe(
						first(),
						map((contactEntities: ContactEntity[]) => {
							this.angularFirestore
								.collection('contact')
								.doc(contactEntities[0].id)
								.update({
									profileImagePath: ''
								});
						})
					);
			})
		);
	}

	public addProfileImage(file: any, loggedInEmail: string): Observable<void> {
		const fileExtension = file.type === 'image/jpeg' ? '.jpg' : '.png';
		const task = this.angularFireStorage.upload(
			loggedInEmail + fileExtension,
			file
		);
		return from(task).pipe(
			mergeMap((response: any) =>
				this.angularFireStorage
					.ref(loggedInEmail + fileExtension)
					.getDownloadURL()
			),
			mergeMap((url: string) =>
				this.angularFirestore
					.collection('contact', (ref) =>
						ref.where('email', '==', loggedInEmail).limit(1)
					)
					.valueChanges({ idField: 'id' })
					.pipe(
						first(),
						mergeMap((contactEntities: ContactEntity[]) =>
							from(
								this.angularFirestore
									.collection('contact')
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
