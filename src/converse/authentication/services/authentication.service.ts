import firebase from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CONTACT_COLLECTION } from 'src/converse/contacts/contact-constants';
import { User } from '../auth-types';

type ContactProfileImagePathAndName = {
	profileImagePath: string;
	name: string;
};

@Injectable()
export class AuthenticationService {
	constructor(
		private angularFireAuth: AngularFireAuth,
		private angularFirestore: AngularFirestore
	) {}

	public loginWith(email: string, password: string): Observable<User> {
		return from(
			this.signInWithEmailAndPasswordAndCheckIfEmailVerified(
				email,
				password
			)
		).pipe(
			mergeMap((userCredentials: firebase.auth.UserCredential) => {
				return this.getProfileImagePathFor(
					userCredentials.user.email
				).pipe(
					map((contactEntities: ContactProfileImagePathAndName[]) => {
						const user = userCredentials.user;
						return {
							id: user.uid,
							email: user.email,
							name: user.displayName,
							profileImagePath:
								contactEntities[0].profileImagePath
						};
					})
				);
			})
		);
	}

	private getProfileImagePathFor(
		email: string
	): Observable<ContactProfileImagePathAndName[]> {
		return this.angularFirestore
			.collection<ContactProfileImagePathAndName>(
				CONTACT_COLLECTION,
				(ref) => ref.where('email', '==', email).limit(1)
			)
			.valueChanges();
	}

	private signInWithEmailAndPasswordAndCheckIfEmailVerified(
		email: string,
		password: string
	): Promise<User | any> {
		return new Promise<firebase.auth.UserCredential | any>(
			(resolve, reject) => {
				this.angularFireAuth
					.signInWithEmailAndPassword(email, password)
					.then((userCredentials: firebase.auth.UserCredential) => {
						if (!userCredentials.user.emailVerified) {
							this.angularFireAuth.signOut();
							reject({ message: 'email-not-verified' });
						}
						resolve(userCredentials);
					})
					.catch(reject);
			}
		);
	}

	public loginWithGoogle(): Observable<any | User> {
		return from(this.loginWithGoogleGuarded()).pipe(
			mergeMap((userCredentials: firebase.auth.UserCredential) => {
				return this.getProfileImagePathFor(
					userCredentials.user.email
				).pipe(
					map((contactEntities: ContactProfileImagePathAndName[]) => {
						const user = userCredentials.user;
						return {
							id: user.uid,
							email: user.email,
							name: user.displayName,
							profileImagePath:
								contactEntities.length !== 0
									? contactEntities[0].profileImagePath
									: user.photoURL
						};
					})
				);
			})
		);
	}

	private loginWithGoogleGuarded(): Promise<any | User> {
		return new Promise<any | User>((resolve, reject) => {
			this.angularFireAuth
				.signInWithPopup(new firebase.auth.GoogleAuthProvider())
				.then(resolve)
				.catch((error: string) => {
					this.angularFireAuth.signOut();
					reject({ reason: error });
				});
		});
	}

	public signupWith(email: string, password: string): Observable<void> {
		return from(
			this.angularFireAuth
				.createUserWithEmailAndPassword(email, password)
				.then((userCredentials: firebase.auth.UserCredential) => {
					return userCredentials.user.sendEmailVerification();
				})
		);
	}

	public signOut(): Observable<void> {
		return from(this.angularFireAuth.signOut());
	}

	public checkLoginStatus(): Observable<User | null> {
		return this.angularFireAuth.authState.pipe(
			mergeMap(
				(userEntity: firebase.User | null): Observable<User | null> => {
					if (userEntity) {
						const user = {
							email: userEntity.email,
							id: userEntity.uid
						};
						return this.getProfileImagePathFor(
							userEntity.email
						).pipe(
							map(
								(
									contactEntities: ContactProfileImagePathAndName[]
								) => {
									return {
										id: user.id,
										email: user.email,
										name: contactEntities[0].name,
										profileImagePath:
											contactEntities[0].profileImagePath
									};
								}
							)
						);
					} else {
						return of(null);
					}
				}
			)
		);
	}
}
