import { Observable } from 'rxjs';
import { Chat } from 'src/converse/chat/chat-types';
import {
	chats, loggedInUserProfileImagePath
} from 'src/converse/chat/store/selectors/selectors';
import { defaultProfileImagePath } from 'src/converse/converse-constants';
import { logOut } from '../../../authentication/store/actions/actions';
import {
	isLogoutSuccess
} from '../../../authentication/store/selectors/selectors';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, DoCheck {
	public profilePictureSource: Observable<string>;
	public shouldShowSettingsMenuOption: boolean;
	public shouldShowHomeMenuOption: boolean;
	public shouldShowNavSearchInput: boolean;
	public defaultProfileImagePath = defaultProfileImagePath;
	constructor(private store: Store, private router: Router) {}

	public ngOnInit(): void {
		this.initializeLogoutSubscription();
		this.loadLoggedInUserProfileImagePath();
	}

	public ngDoCheck(): void {
		this.shouldShowSettingsMenuOption = this.router.url !== '/settings';
		this.shouldShowHomeMenuOption = this.router.url !== '/chat';
		this.initializeShouldShowNavSearchInput();
	}

	private initializeShouldShowNavSearchInput(): void {
		this.store
			.select(chats)
			.subscribe(
				(chatsData: { chats: Chat[] }) =>
					(this.shouldShowNavSearchInput =
						chatsData.chats.length > 0 &&
						this.router.url === '/chat')
			);
	}

	private initializeLogoutSubscription(): void {
		this.store.select(isLogoutSuccess).subscribe(({ isLogoutSuccess }) => {
			if (isLogoutSuccess) {
				this.router.navigate(['landing']);
			}
		});
	}

	private loadLoggedInUserProfileImagePath(): void {
		this.profilePictureSource = this.store.select(
			loggedInUserProfileImagePath
		);
	}

	public signOut(): void {
		this.store.dispatch(logOut());
	}

	public openChatSettings(event: Event): void {
		event.preventDefault();
		this.router.navigate(['settings']);
	}

	public openChatDashboard(event: Event): void {
		event.preventDefault();
		this.router.navigate(['chat']);
	}
}
