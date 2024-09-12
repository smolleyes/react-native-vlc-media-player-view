import { createRef, PureComponent, ReactNode } from 'react';

import { VideoPlayer } from './Player.types';
import { VideoPlayerModule } from './VideoPlayerModule';
import { VideoViewProps } from './VideoView.types';
import { InternalVideoView } from './view/InternalVideoView';

export class VideoView extends PureComponent<VideoViewProps> {
  nativeRef = createRef<any>();

  render(): ReactNode {
    const { player, ...props } = this.props;
    const playerId = getPlayerId(player);

    return <InternalVideoView {...this.props} player={playerId} playerObject={player} ref={this.nativeRef} {...props} />;
  }
}

// Temporary solution to pass the shared object ID instead of the player object.
// We can't really pass it as an object in the old architecture.
// Technically we can in the new architecture, but it's not possible yet.
function getPlayerId(player: number | VideoPlayer): number | null {
  if (player instanceof VideoPlayerModule.VlcPlayer) {
    // @ts-expect-error
    return player.__expo_shared_object_id__;
  }
  if (typeof player === 'number') {
    return player;
  }
  return null;
}
