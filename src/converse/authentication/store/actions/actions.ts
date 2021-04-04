import {
	ContactPayload, LoginFailurePayload, LoginPayload, LoginSuccessPayload,
	RegisterFailurePayload, RegisterPayload
} from '../payload-types';
import * as actionTypes from './action-types';
import { createAction, props } from '@ngrx/store';

export const checkLoginStatus = createAction(actionTypes.CHECK_LOGIN_STATUS);
export const loginStart = createAction(
	actionTypes.LOGIN_START,
	props<LoginPayload>()
);
export const loginEnd = createAction(actionTypes.LOGIN_END);
export const loginProgress = createAction(actionTypes.LOGIN_PROGRESS);
export const loginSuccess = createAction(
	actionTypes.LOGIN_SUCCESS,
	props<LoginSuccessPayload>()
);
export const loginFailure = createAction(
	actionTypes.LOGIN_FAILURE,
	props<LoginFailurePayload>()
);

export const googleLoginStart = createAction(actionTypes.GOOGLE_LOGIN_START);
export const googleLoginEnd = createAction(actionTypes.GOOGLE_LOGIN_END);
export const googleLoginProgress = createAction(
	actionTypes.GOOGLE_LOGIN_PROGRESS
);
export const googleLoginSuccess = createAction(
	actionTypes.GOOGLE_LOGIN_SUCCESS,
	props<LoginSuccessPayload>()
);
export const googleLoginFailure = createAction(
	actionTypes.GOOGLE_LOGIN_FAILURE,
	props<LoginFailurePayload>()
);

export const registerStart = createAction(
	actionTypes.REGISTER_START,
	props<RegisterPayload>()
);
export const registerEnd = createAction(actionTypes.REGISTER_END);
export const registerProgress = createAction(actionTypes.REGISTER_PROGRESS);
export const registerSuccess = createAction(actionTypes.REGISTER_SUCCESS);
export const registerFailure = createAction(
	actionTypes.REGISTER_FAILURE,
	props<RegisterFailurePayload>()
);
export const emailVerificationPopupClose = createAction(
	actionTypes.EMAIL_VERIFICATION_POPUP_CLOSE
);
export const addContact = createAction(
	actionTypes.ADD_CONTACT,
	props<ContactPayload>()
);

export const passwordResetLinkSendStart = createAction(
	actionTypes.PASSWORD_RESET_LINK_SEND_START
);
export const passwordResetLinkSendProgress = createAction(
	actionTypes.PASSWORD_RESET_LINK_SEND_PROGRESS
);
export const passwordResetLinkSendEnd = createAction(
	actionTypes.PASSWORD_RESET_LINK_SEND_END
);
export const resetPasswordResetLinkSendSuccess = createAction(
	actionTypes.RESET_PASSWORD_RESET_LINK_SEND_SUCCESS
);
export const logOut = createAction(actionTypes.LOG_OUT);
export const logOutSuccess = createAction(actionTypes.LOG_OUT_SUCCESS);
