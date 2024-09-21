import { requireNativeViewManager } from 'expo-modules-core';
import { StyleProp, ViewStyle } from 'react-native';
import { VideoSource } from './Player.types';

export type LitePlayerViewProps = {
  style?: StyleProp<ViewStyle> | undefined;
  source: VideoSource;
  paused?: boolean;
};

export const LitePlayerView = requireNativeViewManager<LitePlayerViewProps>('LitePlayerModule');
