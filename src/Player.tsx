import { requireNativeViewManager, useReleasingSharedObject } from 'expo-modules-core';

import { PlayerConfiguration, VideoPlayer } from './Player.types';
import { VideoPlayerModule } from './VideoPlayerModule';

export const Player = requireNativeViewManager('VideoPlayerModule');

export function useVideoPlayer(config?: PlayerConfiguration, setup?: (player: VideoPlayer) => void): VideoPlayer {
  return useReleasingSharedObject(() => {
    const player = new VideoPlayerModule.VlcPlayer(config);
    setup?.(player);
    return player;
  }, [JSON.stringify(config)]);
}
