import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { ChatStoreKey } from './chat-constants';
import { ChatEffects } from './store/effects/effects';
import { reducer } from './store/reducers/reducers';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ContactsModule } from '../contacts/contacts.module';
import { NavModule } from '../nav/nav.module';
import {
	ChatDashboardContentComponent
} from './components/chat-dashboard-content/chat-dashboard-content.component';
import {
	ChatDashboardComponent
} from './components/chat-dashboard/chat-dashboard.component';
import {
	ChatInputComponent
} from './components/chat-input/chat-input.component';
import {
	ChatMessageComponent
} from './components/chat-message/chat-message.component';
import {
	ChatMessagesWindowComponent
} from './components/chat-messages-window/chat-messages-window.component';
import {
	ChatMessagesComponent
} from './components/chat-messages/chat-messages.component';
import {
	ChatSettingsComponent
} from './components/chat-settings/chat-settings.component';
import {
	ChatWindowComponent
} from './components/chat-window/chat-window.component';
import { ChatBlockLoaderService } from './services/chat-block-loader.service';
import { ChatLoaderService } from './services/chat-loader.service';
import { ChatSaverService } from './services/chat-saver.service';
import {
	ContactProfileImageService
} from './services/contact-profile-image.service';

const routes = [
	{
		path: '',
		component: ChatDashboardComponent
	}
];

@NgModule({
	declarations: [
		ChatDashboardComponent,
		ChatWindowComponent,
		ChatInputComponent,
		ChatMessagesWindowComponent,
		ChatMessagesComponent,
		ChatMessageComponent,
		ChatDashboardContentComponent,
		ChatSettingsComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NavModule,
		FormsModule,
		NgxEmojiPickerModule,
		ContactsModule,
		AngularFireModule,
		AngularFireStorageModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatCardModule,
		MatProgressSpinnerModule,
		MatButtonModule,
		ReactiveComponentModule,
		ScrollingModule,
		StoreModule.forFeature(ChatStoreKey, reducer),
		EffectsModule.forFeature([ChatEffects])
	],
	providers: [
		ChatLoaderService,
		ChatSaverService,
		ChatBlockLoaderService,
		ContactProfileImageService
	]
})
export class ChatModule {}
