import { useReleasingSharedObject } from 'expo-modules-core';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import { PlayerConfiguration, VideoPlayer } from './Player.types';
import { VideoPlayerModule } from './VideoPlayerModule';
import { VideoSource } from './VideoView.types';

export function useVideoPlayer(config?: PlayerConfiguration, setup?: (player: VideoPlayer) => void): VideoPlayer {
  return useReleasingSharedObject(() => {
    const player = new VideoPlayerModule.VlcPlayer(config);
    setup?.(player);
    return player;
  }, [JSON.stringify(config)]);
}

function parseSource(source: VideoSource): VideoSource {
  if (typeof source === 'number') {
    return { uri: resolveAssetSource(source).uri };
  } else if (typeof source === 'string') {
    return { uri: source };
  }

  if (typeof source?.assetId === 'number' && !source.uri) {
    return { ...source, uri: resolveAssetSource(source.assetId).uri };
  }
  return source;
}
