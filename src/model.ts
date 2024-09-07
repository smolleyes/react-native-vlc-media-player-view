import { Ref } from 'react';
import { ViewProps, ViewStyle } from 'react-native';

export interface PlayerRef {
  setSource: (source: PlayerSource) => void;

  setPaused: (paused: boolean) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  isPlaying: () => boolean;

  getVolume: () => number;
  setVolume: (volume: number) => void;

  getAudioDelay: () => number;
  setAudioDelay: (delay: number) => void;

  seekTo: (time: number) => void;
  isSeekable: () => boolean;
  getTime: () => number;

  getSelectedAudioTrack: () => Track;
  getSelectedTextTrack: () => Track;
  getAudioTracks: () => Track[];
  getTextTracks: () => Track[];
}

export type PlayerProps = {
  ref?: Ref<PlayerRef>;
  style?: ViewStyle;
  source?: PlayerSource;
  scale?: VideoScale;
  paused?: boolean;
  audioTrack?: number;
  textTrack?: number;
  onLoaded?: (videoinfo: VideoInfo) => void;
  onProgress?: (progressInfo: ProgressInfo) => void;
  onPlaying?: (playing: boolean) => void;
  onEnd?: () => void;
  onError?: () => void;
};

export interface PlayerSource {
  uri: string;
  autoplay?: boolean;
}

export interface VideoInfo {
  videoSize: {
    width: number;
    height: number;
  };
  seekable: boolean;
  duration?: number;
  audioTracks?: Track[];
  textTracks?: Track[];
}

export interface ProgressInfo {
  currentTime: number;
  position: number;
}

export type Track = {
  id: number;
  name: string;
};

export type VideoScale = 'best_fit' | 'fit_screen' | 'fill_screen' | 'ratio_16_9' | 'ratio_16_10' | 'ratio_4_3' | 'original';

export type PlayerViewProps = ViewProps &
  PlayerProps & {
    position?: number;
    title?: string;
    backUrl?: string;
    onNext?: () => any;
    onPrevious?: () => any;
    onTimeChanged: (time: number) => void;
  };
