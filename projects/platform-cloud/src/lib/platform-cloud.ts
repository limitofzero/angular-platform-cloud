import { DOCUMENT } from '@angular/common';
import { createPlatformFactory, ErrorHandler, isDevMode, NgZone, platformCore, PlatformRef, StaticProvider } from '@angular/core';
import {
  EVENT_MANAGER_PLUGINS,
  EventManager,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  ɵBROWSER_SANITIZATION_PROVIDERS as BROWSER_SANITIZATION_PROVIDERS,
  ɵBROWSER_SANITIZATION_PROVIDERS__POST_R3__ as BROWSER_SANITIZATION_PROVIDERS__POST_R3__,
  ɵDomEventsPlugin as DomEventsPlugin,
  ɵHammerGesturesPlugin as HammerGesturesPlugin,
  ɵKeyEventsPlugin as KeyEventsPlugin
} from '@angular/platform-browser';
import { ɵNoopNgZone as NoopNgZone } from '@angular/core';

export { CloudServerModule, ServerCommandSubject, BrowserCommandSubject } from './server';
export { CloudBrowserModule } from './browser';
export { CommandType } from './shared';

export const PLATFORM_CLOUD_SHARED_PROVIDERS: StaticProvider[] = [];

export const PLATFORM_CLOUD_SERVER_PROVIDERS: StaticProvider[] = [
  BROWSER_SANITIZATION_PROVIDERS,
  {provide: NgZone, useFactory: createNgZone, deps: []},
  { provide: ErrorHandler, useFactory: errorHandler, deps: [] },
  { provide: DOCUMENT, useValue: {} }
];

export const PLATFORM_CLOUD_BROWSER_PROVIDERS: StaticProvider[] = [
  BROWSER_SANITIZATION_PROVIDERS__POST_R3__,
  { provide: NgZone, useClass: NoopNgZone },
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: DomEventsPlugin,
    deps: [DOCUMENT, NgZone],
    multi: true
  },
  {provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, deps: [DOCUMENT], multi: true},
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: HammerGesturesPlugin,
    deps: [DOCUMENT, HAMMER_GESTURE_CONFIG],
    multi: true
  },
  {provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig, deps: []},
  {provide: EventManager, deps: [EVENT_MANAGER_PLUGINS, NgZone]},
  { provide: ErrorHandler, useFactory: errorHandler, deps: [] },
  { provide: DOCUMENT, useFactory: documentFactory, deps: [] }
];


export const platformCloudServer =
  createPlatformFactory(platformCore, 'cloudServer', [PLATFORM_CLOUD_SHARED_PROVIDERS, PLATFORM_CLOUD_SERVER_PROVIDERS]);

export const platformCloudBrowser =
  createPlatformFactory(platformCore, 'cloudBrowser', [PLATFORM_CLOUD_SHARED_PROVIDERS, PLATFORM_CLOUD_BROWSER_PROVIDERS]);


export function bootstrapCloudServer(customProviders: StaticProvider[] = []): Promise<PlatformRef> {
  const platform = platformCloudServer(customProviders);
  return Promise.resolve(platform);
}

export function bootstrapCloudBrowser(customProviders: StaticProvider[] = []): Promise<PlatformRef> {
  const platform = platformCloudBrowser(customProviders);
  return Promise.resolve(platform);
}

function createNgZone(): NgZone {
  return new NgZone({enableLongStackTrace: isDevMode()});
}

function errorHandler(): ErrorHandler {
  return new ErrorHandler();
}

function documentFactory(): Document {
  return document;
}
