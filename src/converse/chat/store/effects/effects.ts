import { from } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Chat } from '../../chat-types';
import * as actionTypes from '../actions/action-types';
import {
	addProfileImageEnd, addProfileImageFailure, deleteProfileImageEnd,
	deleteProfileImageFailure, loadChatEnd, loadChatFailure, sendMessageEnd,
	sendMessageFailure
} from '../actions/actions';
import { SendMessageStartPayload } from '../payload-types';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
	ChatBlockLoaderService
} from '../../services/chat-block-loader.service';
import { ChatLoaderService } from '../../services/chat-loader.service';
import { ChatSaverService } from '../../services/chat-saver.service';
import {
	ContactProfileImageService
} from '../../services/contact-profile-image.service';

@Injectable()
export class ChatEffects {
	constructor(
		private actions: Actions,
		private chatLoaderService: ChatLoaderService,
		private chatSaverService: ChatSaverService,
		private chatBlockLoaderService: ChatBlockLoaderService,
		private contactProfileImageService: ContactProfileImageService
	) {}

	public loadChatStart = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.LOAD_CHAT_START),
			mergeMap(({ senderEmail, recipientEmail }) =>
				this.chatLoaderService
					.loadChatsFor(senderEmail, recipientEmail)
					.pipe(
						map((chats: Chat[]) => ({
							chats,
							senderEmail,
							recipientEmail
						}))
					)
			),
			mergeMap(({ chats, senderEmail, recipientEmail }) =>
				this.chatBlockLoaderService
					.isChatBlockedFor(senderEmail, recipientEmail)
					.pipe(
						map((blockChatId: string) => ({
							chats,
							senderEmail,
							blockChatId
						}))
					)
			),
			mergeMap(({ chats, senderEmail, blockChatId }) => [
				{
					type: actionTypes.LOAD_CHAT_SUCCESS,
					chats,
					senderEmail,
					blockChatId
				},
				{
					type: actionTypes.LOAD_CHAT_END
				}
			]),
			catchError((error) =>
				from([
					loadChatFailure({ reason: error.message }),
					loadChatEnd()
				])
			)
		)
	);

	public sendMessageStart = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.SEND_MESSAGE_START),
			mergeMap((sendMessageStartPayload: SendMessageStartPayload) =>
				this.chatSaverService.sendMessage(
					sendMessageStartPayload.from,
					sendMessageStartPayload.to,
					sendMessageStartPayload.message
				)
			),
			mergeMap((res: any) => [
				{
					type: actionTypes.SEND_MESSAGE_SUCCESS
				},
				{
					type: actionTypes.SEND_MESSAGE_END
				}
			]),
			catchError((error: any) =>
				from([sendMessageFailure(error.message), sendMessageEnd()])
			)
		)
	);

	public deleteProfileImageStart = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.DELETE_PROFILE_IMAGE_START),
			mergeMap(({ profileImagePath, loggedInEmail }) =>
				this.contactProfileImageService.deleteProfileImage(
					profileImagePath,
					loggedInEmail
				)
			),
			mergeMap(() => [
				{
					type: actionTypes.DELETE_PROFILE_IMAGE_SUCCESS
				},
				{
					type: actionTypes.DELETE_PROFILE_IMAGE_END
				}
			]),
			catchError((error: any) =>
				from([
					deleteProfileImageFailure({ reason: error.message }),
					deleteProfileImageEnd()
				])
			)
		)
	);

	public addProfileImageStart = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.ADD_PROFILE_IMAGE_START),
			mergeMap(({ file, loggedInEmail }) =>
				this.contactProfileImageService.addProfileImage(
					file,
					loggedInEmail
				)
			),
			mergeMap(() => [
				{
					type: actionTypes.ADD_PROFILE_IMAGE_SUCCESS
				},
				{
					type: actionTypes.ADD_PROFILE_IMAGE_END
				}
			]),
			catchError((error: any) =>
				from([
					addProfileImageFailure({ reason: error.message }),
					addProfileImageEnd()
				])
			)
		)
	);
}
