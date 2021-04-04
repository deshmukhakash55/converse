export type AuthStoreState = {
	loggedInUser: User;
	isLoginProgress: boolean;
	isGoogleLoginProgress: boolean;
	isRegisterProgress: boolean;
	loginError: string;
	registerError: string;
	isRegisterSuccess: boolean;
	passwordResetLinkSentProgress: boolean;
	passwordResetLinkSentSuccess: boolean;
};

export type User = {
	id: string;
	email: string;
	name: string;
	profileImagePath: string;
};
