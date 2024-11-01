import { requireNativeViewManager, useReleasingSharedObject } from 'expo-modules-core';

import { createRef, PureComponent, ReactNode } from 'react';
import { PlayerConfiguration, PlayerViewProps, VideoPlayer } from './Player.types';
import { VideoPlayerModule } from './VideoPlayerModule';

export const RNPlayerView = requireNativeViewManager<any>('VideoPlayerModule');

export function useVideoPlayer(config?: PlayerConfiguration, setup?: (player: VideoPlayer) => void): VideoPlayer {
  return useReleasingSharedObject(() => {
    const player = new VideoPlayerModule.VlcPlayer(config);
    setup?.(player);
    return player;
  }, [JSON.stringify(config)]);
}

export class PlayerView extends PureComponent<PlayerViewProps> {
  nativeRef = createRef<any>();

  render(): ReactNode {
    const { player, ...props } = this.props;
    const playerId = getPlayerId(player);

    return <RNPlayerView player={playerId} ref={this.nativeRef} {...props} />;
  }
}

// Temporary solution to pass the shared object ID instead of the player object.
// We can't really pass it as an object in the old architecture.
// Technically we can in the new architecture, but it's not possible yet.
export function getPlayerId(player: number | VideoPlayer): number | null {
  if (player instanceof VideoPlayerModule.VlcPlayer) {
    // @ts-expect-error
    return player.__expo_shared_object_id__;
  }
  if (typeof player === 'number') {
    return player;
  }
  return null;
}
