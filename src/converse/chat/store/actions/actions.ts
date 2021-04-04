import {
	AddProfileImageFailurePayload, AddProfileImageStartPayload,
	AddProfileImageSuccessPayload, DeleteProfileImageFailurePayload,
	DeleteProfileImageStartPayload, LoadChatFailurePayload,
	LoadChatStartPayload, LoadChatSuccessPayload, SendMessageFailurePayload,
	SendMessageStartPayload
} from '../payload-types';
import * as actionTypes from './action-types';
import { createAction, props } from '@ngrx/store';

export const loadChatStart = createAction(
	actionTypes.LOAD_CHAT_START,
	props<LoadChatStartPayload>()
);
export const loadChatProgress = createAction(actionTypes.LOAD_CHAT_PROGRESS);
export const loadChatEnd = createAction(actionTypes.LOAD_CHAT_END);
export const loadChatSuccess = createAction(
	actionTypes.LOAD_CHAT_SUCCESS,
	props<LoadChatSuccessPayload>()
);
export const loadChatFailure = createAction(
	actionTypes.LOAD_CHAT_FAILURE,
	props<LoadChatFailurePayload>()
);

export const sendMessageStart = createAction(
	actionTypes.SEND_MESSAGE_START,
	props<SendMessageStartPayload>()
);
export const sendMessageProgress = createAction(
	actionTypes.SEND_MESSAGE_PROGRESS
);
export const sendMessageEnd = createAction(actionTypes.SEND_MESSAGE_END);
export const sendMessageSuccess = createAction(
	actionTypes.SEND_MESSAGE_SUCCESS
);
export const sendMessageFailure = createAction(
	actionTypes.SEND_MESSAGE_FAILURE,
	props<SendMessageFailurePayload>()
);

export const deleteProfileImageStart = createAction(
	actionTypes.DELETE_PROFILE_IMAGE_START,
	props<DeleteProfileImageStartPayload>()
);
export const deleteProfileImageProgress = createAction(
	actionTypes.DELETE_PROFILE_IMAGE_PROGRESS
);
export const deleteProfileImageEnd = createAction(
	actionTypes.DELETE_PROFILE_IMAGE_END
);
export const deleteProfileImageSuccess = createAction(
	actionTypes.DELETE_PROFILE_IMAGE_SUCCESS
);
export const deleteProfileImageFailure = createAction(
	actionTypes.DELETE_PROFILE_IMAGE_FAILURE,
	props<DeleteProfileImageFailurePayload>()
);

export const addProfileImageStart = createAction(
	actionTypes.ADD_PROFILE_IMAGE_START,
	props<AddProfileImageStartPayload>()
);
export const addProfileImageProgress = createAction(
	actionTypes.ADD_PROFILE_IMAGE_PROGRESS
);
export const addProfileImageEnd = createAction(
	actionTypes.ADD_PROFILE_IMAGE_END
);
export const addProfileImageSuccess = createAction(
	actionTypes.ADD_PROFILE_IMAGE_SUCCESS,
	props<AddProfileImageSuccessPayload>()
);
export const addProfileImageFailure = createAction(
	actionTypes.ADD_PROFILE_IMAGE_FAILURE,
	props<AddProfileImageFailurePayload>()
);

export const reinitChatState = createAction(actionTypes.REINIT_CHAT_STATE);
