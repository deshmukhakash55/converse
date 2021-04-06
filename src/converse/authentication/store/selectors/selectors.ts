import { AuthStoreKey } from '../../auth-constants';
import { AuthStoreState } from '../../auth-types';
import { createSelector } from '@ngrx/store';

const authStateSelector = (state) => state[AuthStoreKey];

export const isLoggingInProcessProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) =>
		authStoreState.isLoginProgress || authStoreState.isGoogleLoginProgress
);

export const isLoggingInProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => authStoreState.isLoginProgress
);

export const isRegisterProcessProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) =>
		authStoreState.isRegisterProgress ||
		authStoreState.isGoogleLoginProgress
);

export const isRegisterProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => authStoreState.isRegisterProgress
);

export const isGoogleLoginProgress = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => authStoreState.isGoogleLoginProgress
);

export const isLoginFailure = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => authStoreState.loginError
);

export const isRegisterFailure = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => authStoreState.registerError
);

export const isRegisterSuccess = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => authStoreState.isRegisterSuccess
);

export const isLoginSuccess = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => !!authStoreState.loggedInUser
);

export const isLogoutSuccess = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => !authStoreState.loggedInUser
);

export const loggedInUser = createSelector(
	authStateSelector,
	(authStoreState: AuthStoreState) => ({
		...authStoreState.loggedInUser
	})
);
