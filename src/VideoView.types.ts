import { ViewProps } from 'react-native';

import { Track, VideoPlayer } from './Player.types';

export type OnLoadedEvent = { nativeEvent: VideoInfo };
export type OnProgessEvent = { nativeEvent: ProgressInfo };
export type OnPausedEvent = { nativeEvent: { payload: boolean } };

export type VideoViewProps = ViewProps & {
  player: VideoPlayer;
  /**
   * The player have to play the video before being able to received this event.
   */
  onLoaded?: (event: OnLoadedEvent) => void;
  onProgress?: (event: OnProgessEvent) => void;
  onPaused?: (paused: OnPausedEvent) => void;
  onEnded?: () => void;
  onError?: () => void;
};

export interface VideoInfo {
  videoSize: {
    width: number;
    height: number;
  };
  seekable: boolean;
  duration: number;
  audioTracks: Track[];
  textTracks: Track[];
}

export interface ProgressInfo {
  time: number;
  position: number;
}
