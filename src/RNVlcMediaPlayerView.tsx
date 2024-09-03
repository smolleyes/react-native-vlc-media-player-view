import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { RNVlcMediaPlayerViewProps } from './RNVlcMediaPlayerView.types';

const NativeView: React.ComponentType<RNVlcMediaPlayerViewProps> =
  requireNativeViewManager('RNVlcMediaPlayerView');

export default function RNVlcMediaPlayerView(props: RNVlcMediaPlayerViewProps) {
  return <NativeView {...props} />;
}
