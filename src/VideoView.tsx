import { createRef, PureComponent, ReactNode } from 'react';

import { getPlayerId } from './Player';
import { VideoViewProps } from './VideoView.types';
import { InternalVideoView } from './view/InternalVideoView';

export class VideoView extends PureComponent<VideoViewProps> {
  nativeRef = createRef<any>();

  render(): ReactNode {
    const { player, ...props } = this.props;
    const playerId = getPlayerId(player);

    return <InternalVideoView player={playerId} playerObject={player} ref={this.nativeRef} {...props} />;
  }
}
