import { ViewProps } from 'react-native';

import { Track, VideoPlayer } from './Player.types';

export type VideoViewProps = ViewProps & {
  player: VideoPlayer;
  onLoaded?: (event: { nativeEvent: VideoInfo }) => void;
  onProgress?: (event: { nativeEvent: ProgressInfo }) => void;
  onPlaying?: (isPlaying: { nativeEvent: boolean }) => void;
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
