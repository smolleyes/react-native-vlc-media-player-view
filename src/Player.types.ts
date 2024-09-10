import { SharedObject } from 'expo-modules-core/build/ts-declarations/SharedObject';

import { Track, VideoInfo, VideoSource } from './VideoView.types';

export type PlayerConfiguration = {
  initOptions?: string[];
};

export type VideoPlayerEvents = {
  onLoaded: (event: VideoInfo) => void;
};

export declare class VideoPlayer extends SharedObject<VideoPlayerEvents> {
  source: VideoSource;
  paused: boolean;
  /**
   * The current time of the player in milliseconds.
   */
  time: number;
  /**
   * The current position of the player between 0 and 1.
   */
  position: number;
  readonly isPlaying: boolean;
  readonly isSeekable: boolean;
  readonly audioTracks: Track[];
  readonly textTracks: Track[];
  selectedAudioTrack: Track;
  selectedTextTrack: Track;
  /**
   * The delay between the video and the audio in milliseconds.
   */
  audioDelay: number;

  constructor(config?: PlayerConfiguration);

  play(source?: VideoSource): void;
  pause(): void;
  togglePlay(): void;
}
