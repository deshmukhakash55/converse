import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { reinitChatState } from 'src/converse/chat/store/actions/actions';
import {
	reinitContactState
} from 'src/converse/contacts/store/actions/actions';
import { reinitNavState } from 'src/converse/nav/store/actions/actions';
import { User } from '../../auth-types';
import * as actionTypes from '../actions/action-types';
import {
	googleLoginEnd, googleLoginFailure, loginEnd, loginFailure, logOutSuccess,
	registerEnd, registerFailure
} from '../actions/actions';
import { ContactPayload } from '../payload-types';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthenticationService } from '../../services/authentication.service';
import { ContactSaverService } from '../../services/contact-saver.service';

@Injectable()
export class AuthenticationEffects {
	constructor(
		private actions: Actions,
		private authenticationService: AuthenticationService,
		private contactSaverService: ContactSaverService
	) {}

	public checkLoginStatus = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.CHECK_LOGIN_STATUS),
			mergeMap(() => this.authenticationService.checkLoginStatus()),
			mergeMap((user: User | null) => {
				if (user) {
					return of({
						type: actionTypes.LOGIN_SUCCESS,
						user
					});
				} else {
					return of({
						type: actionTypes.LOGIN_FAILURE,
						reason: 'User not logged in'
					});
				}
			})
		)
	);

	public loginWithEmailAndPassword = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.LOGIN_START),
			mergeMap(({ email, password }) =>
				this.authenticationService.loginWith(email, password)
			),
			mergeMap((user: User) => [
				{
					type: actionTypes.LOGIN_SUCCESS,
					user
				},
				{
					type: actionTypes.LOGIN_END
				}
			]),
			catchError((error: any) =>
				from([loginFailure({ reason: error.message }), loginEnd()])
			)
		)
	);

	public loginWithGoogle = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.GOOGLE_LOGIN_START),
			mergeMap(() => this.authenticationService.loginWithGoogle()),
			mergeMap((user: User) => [
				{
					type: actionTypes.GOOGLE_LOGIN_SUCCESS,
					user
				},
				{
					type: actionTypes.GOOGLE_LOGIN_END
				},
				{
					type: actionTypes.ADD_CONTACT,
					contact: {
						name: user.name,
						email: user.email,
						profileImagePath: user.profileImagePath
					}
				}
			]),
			catchError((error: any) =>
				from([
					googleLoginFailure({ reason: error.message }),
					googleLoginEnd()
				])
			)
		)
	);

	public signupWithEmailAndPassword = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.REGISTER_START),
			mergeMap(({ name, email, password }) =>
				this.authenticationService
					.signupWith(email, password)
					.pipe(map(() => ({ name, email, password })))
			),
			mergeMap(({ name, email }) => [
				{
					type: actionTypes.REGISTER_SUCCESS
				},
				{
					type: actionTypes.REGISTER_END
				},
				{
					type: actionTypes.ADD_CONTACT,
					contact: {
						name,
						email
					}
				}
			]),
			catchError((error: any) =>
				from([
					registerFailure({ reason: error.message }),
					registerEnd()
				])
			)
		)
	);

	public addContact = createEffect(
		() =>
			this.actions.pipe(
				ofType(actionTypes.ADD_CONTACT),
				mergeMap((contactPayload: ContactPayload) =>
					this.contactSaverService
						.addContact(contactPayload)
						.then(() => {})
				),
				catchError((error) => of(console.log(error)))
			),
		{ dispatch: false }
	);

	public logOut = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.LOG_OUT),
			mergeMap(() => this.authenticationService.signOut()),
			mergeMap(() =>
				from([
					logOutSuccess(),
					reinitChatState(),
					reinitContactState(),
					reinitNavState()
				])
			)
		)
	);
}
