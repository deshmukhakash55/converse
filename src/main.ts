import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ConverseModule } from './converse/converse.module';

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(ConverseModule)
	.catch((err) => console.error(err));
