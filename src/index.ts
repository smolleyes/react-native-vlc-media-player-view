import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to RNVlcMediaPlayerView.web.ts
// and on native platforms to RNVlcMediaPlayerView.ts
import RNVlcMediaPlayerViewModule from './RNVlcMediaPlayerViewModule';
import RNVlcMediaPlayerView from './RNVlcMediaPlayerView';
import { ChangeEventPayload, RNVlcMediaPlayerViewProps } from './RNVlcMediaPlayerView.types';

// Get the native constant value.
export const PI = RNVlcMediaPlayerViewModule.PI;

export function hello(): string {
  return RNVlcMediaPlayerViewModule.hello();
}

export async function setValueAsync(value: string) {
  return await RNVlcMediaPlayerViewModule.setValueAsync(value);
}

const emitter = new EventEmitter(RNVlcMediaPlayerViewModule ?? NativeModulesProxy.RNVlcMediaPlayerView);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { RNVlcMediaPlayerView, RNVlcMediaPlayerViewProps, ChangeEventPayload };
