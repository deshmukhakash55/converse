import { AuthStoreKey } from '../../auth-constants';
import { AuthStoreState } from '../../auth-types';
import { state } from '@angular/animations';
import { createSelector } from '@ngrx/store';

const authStateSelector = (state) => state[AuthStoreKey];

export const isLoggingInProcessProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		isLoginProcessProgress:
			authStoreState.isLoginProgress ||
			authStoreState.isGoogleLoginProgress
	})
);

export const isLoggingInProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		isLoginProgress: authStoreState.isLoginProgress
	})
);

export const isRegisterProcessProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		isRegisterProcessProgress:
			authStoreState.isRegisterProgress ||
			authStoreState.isGoogleLoginProgress
	})
);

export const isRegisterProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		isRegisterProgress: authStoreState.isRegisterProgress
	})
);

export const isGoogleLoginProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		isGoogleLoginProgress: authStoreState.isGoogleLoginProgress
	})
);

export const isLoginFailure = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		loginError: authStoreState.loginError
	})
);

export const isRegisterFailure = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		registerError: authStoreState.registerError
	})
);

export const isRegisterSuccess = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		isRegisterSuccess: authStoreState.isRegisterSuccess
	})
);

export const isLoginSuccess = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		isLoginSuccess: !!Object.keys(authStoreState.loggedInUser).length
	})
);

export const isLogoutSuccess = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		isLogoutSuccess: !Object.keys(authStoreState.loggedInUser).length
	})
);

export const loggedInUser = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		...authStoreState.loggedInUser
	})
);
