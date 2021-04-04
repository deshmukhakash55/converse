import firebase from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CONTACT_COLLECTION } from 'src/converse/contacts/contact-constants';
import { User } from '../auth-types';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class AuthenticationService {
	constructor(
		private angularFireAuth: AngularFireAuth,
		private angularFirestore: AngularFirestore
	) {}

	public loginWith(email: string, password: string): Observable<any | User> {
		return from(
			this.signInWithEmailAndPasswordAndCheckIfEmailVerified(
				email,
				password
			)
		).pipe(
			mergeMap((userCredentials: firebase.auth.UserCredential) => {
				return this.angularFirestore
					.collection<{ profileImagePath }>(
						CONTACT_COLLECTION,
						(ref) =>
							ref
								.where(
									'email',
									'==',
									userCredentials.user.email
								)
								.limit(1)
					)
					.valueChanges()
					.pipe(
						map(
							(
								contactEntities: { profileImagePath: string }[]
							) => {
								const user = userCredentials.user;
								return {
									id: user.uid,
									email: user.email,
									name: user.displayName,
									profileImagePath:
										contactEntities[0].profileImagePath
								};
							}
						)
					);
			})
		);
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
				return this.angularFirestore
					.collection<{ profileImagePath }>(
						CONTACT_COLLECTION,
						(ref) =>
							ref
								.where(
									'email',
									'==',
									userCredentials.user.email
								)
								.limit(1)
					)
					.valueChanges()
					.pipe(
						map(
							(
								contactEntities: { profileImagePath: string }[]
							) => {
								const user = userCredentials.user;
								return {
									id: user.uid,
									email: user.email,
									name: user.displayName,
									profileImagePath:
										contactEntities.length !== 0
											? contactEntities[0]
													.profileImagePath
											: user.photoURL
								};
							}
						)
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
						return this.angularFirestore
							.collection<{ profileImagePath }>(
								CONTACT_COLLECTION,
								(ref) =>
									ref
										.where('email', '==', userEntity.email)
										.limit(1)
							)
							.valueChanges()
							.pipe(
								map(
									(
										contactEntities: {
											profileImagePath: string;
											name: string;
										}[]
									) => {
										return {
											id: user.id,
											email: user.email,
											name: contactEntities[0].name,
											profileImagePath:
												contactEntities[0]
													.profileImagePath
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
