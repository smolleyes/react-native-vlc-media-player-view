import { requireNativeViewManager } from 'expo-modules-core';

import { PlayerProps } from './model';

export const VlcPlayer: React.ComponentType<PlayerProps> = requireNativeViewManager('RNVlcPlayer');
