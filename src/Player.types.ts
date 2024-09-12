import { SharedObject } from 'expo-modules-core/build/ts-declarations/SharedObject';

export type PlayerConfiguration = {
  initOptions?: string[];
};

export declare class VideoPlayer extends SharedObject {
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
  /**
   * The selected audio track id.
   */
  selectedAudioTrackId: string | null;
  /**
   * The selected text track id.
   */
  selectedTextTrackId: string | null;
  /**
   * The delay between the video and the audio in milliseconds.
   */
  audioDelay: number;

  constructor(config?: PlayerConfiguration);

  play(source?: VideoSource): void;
  pause(): void;
  togglePlay(): void;
}

export type VideoSource = {
  uri?: string;
  assetId?: number;
};

export type Track = {
  id: string;
  name: string;
};
