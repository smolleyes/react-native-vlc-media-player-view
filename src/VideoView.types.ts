import { ViewProps } from 'react-native';

import { VideoPlayer } from './Player.types';

export type VideoSource = {
  uri?: string;
};

export type Track = {
  id: number;
  name: string;
};

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
}

export interface ProgressInfo {}
