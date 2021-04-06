import { AuthStoreState } from '../../auth-types';
import {
	emailVerificationPopupClose, googleLoginEnd, googleLoginFailure,
	googleLoginProgress, googleLoginSuccess, loginEnd, loginFailure,
	loginProgress, loginSuccess, logOutSuccess, passwordResetLinkSendEnd,
	passwordResetLinkSendProgress, registerEnd, registerFailure,
	registerProgress, registerSuccess, resetPasswordResetLinkSendSuccess
} from '../actions/actions';
import {
	LoginFailurePayload, LoginSuccessPayload, RegisterFailurePayload
} from '../payload-types';
import { createReducer, on } from '@ngrx/store';

const initialState: AuthStoreState = {
	loggedInUser: null,
	isLoginProgress: false,
	isRegisterProgress: false,
	isGoogleLoginProgress: false,
	loginError: '',
	registerError: '',
	isRegisterSuccess: false,
	passwordResetLinkSentProgress: false,
	passwordResetLinkSentSuccess: false
};

export const reducer = createReducer(
	initialState,
	on(loginProgress, (state: AuthStoreState) => ({
		...state,
		isLoginProgress: true
	})),
	on(loginEnd, (state: AuthStoreState) => ({
		...state,
		isLoginProgress: false
	})),
	on(
		loginSuccess,
		(state: AuthStoreState, loginSuccessPayload: LoginSuccessPayload) => ({
			...state,
			loggedInUser: {
				...loginSuccessPayload.user
			}
		})
	),
	on(
		loginFailure,
		(state: AuthStoreState, loginFailurePayload: LoginFailurePayload) => ({
			...state,
			loginError: loginFailurePayload.reason,
			isLoginProgress: false
		})
	),
	on(googleLoginProgress, (state: AuthStoreState) => ({
		...state,
		isGoogleLoginProgress: true
	})),
	on(googleLoginEnd, (state: AuthStoreState) => ({
		...state,
		isGoogleLoginProgress: false
	})),
	on(
		googleLoginSuccess,
		(state: AuthStoreState, loginSuccessPayload: LoginSuccessPayload) => ({
			...state,
			loggedInUser: {
				...loginSuccessPayload.user
			}
		})
	),
	on(
		googleLoginFailure,
		(state: AuthStoreState, loginFailurePayload: LoginFailurePayload) => ({
			...state,
			loginError: loginFailurePayload.reason,
			isGoogleLoginProgress: false
		})
	),
	on(registerProgress, (state: AuthStoreState) => ({
		...state,
		isRegisterProgress: true
	})),
	on(registerEnd, (state: AuthStoreState) => ({
		...state,
		isRegisterProgress: false
	})),
	on(registerSuccess, (state: AuthStoreState) => ({
		...state,
		isRegisterSuccess: true
	})),
	on(
		registerFailure,
		(
			state: AuthStoreState,
			registerFailurePayload: RegisterFailurePayload
		) => ({
			...state,
			registerError: registerFailurePayload.reason,
			registerSuccess: false
		})
	),
	on(emailVerificationPopupClose, (state: AuthStoreState) => ({
		...state,
		registerSuccess: false
	})),
	on(passwordResetLinkSendProgress, (state: AuthStoreState) => ({
		...state,
		passwordResetLinkSentProgress: true,
		passwordResetLinkSentSuccess: false
	})),
	on(passwordResetLinkSendEnd, (state: AuthStoreState) => ({
		...state,
		passwordResetLinkSentProgress: false,
		passwordResetLinkSentSuccess: true
	})),
	on(resetPasswordResetLinkSendSuccess, (state: AuthStoreState) => ({
		...state,
		passwordResetLinkSentSuccess: false
	})),
	on(logOutSuccess, (state: AuthStoreState) => ({
		...state,
		loggedInUser: null
	}))
);
