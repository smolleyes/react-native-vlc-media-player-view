import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { VlcPlayer } from '../Player';
import { PlayerRef, PlayerSource, ProgressInfo, VideoInfo } from '../model';
import useAppStatusChange from './hooks/useAppStatusChange';
import useDebounceTimeChanged from './hooks/useDebounceTimeChanged';

type PlayerWrapperProps = {
  source: PlayerSource;
  position?: number;
  seekStep?: number;
  onEnd?: () => any;
  onProgress?: (event: ProgressInfo) => void;
  onLoaded?: (event: VideoInfo) => void;
  onPaused?: (paused: boolean) => void;
  onError?: () => void;
  onTimeChanged?: (time: number) => void;
};

export type PlayerWrapperRef = {
  forward: () => void;
  backward: () => void;
  seekTo: (value: number) => void;
  togglePlay: () => void;
  videoInfo: VideoInfo | undefined;
  audioTrack?: number;
  setAudioTrack: (id: number) => void;
  textTrack?: number;
  setTextTrack: (id: number) => void;
};

export const PlayerWrapper = forwardRef<PlayerWrapperRef, PlayerWrapperProps>(
  ({ source, position = 0, seekStep = 15, onEnd, onProgress, onLoaded, onPaused, onError, onTimeChanged }, ref) => {
    const player = useRef<PlayerRef>(null);

    const [progress, setProgress] = useState<ProgressInfo>();
    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(true);

    const [audioTrack, setAudioTrack] = useState<number>();
    const [textTrack, setTextTrack] = useState<number>();

    const [videoInfo, setVideoInfo] = useState<VideoInfo>();
    const windowDimensions = useWindowDimensions();
    const videoSize = calculateVideoDimensions(windowDimensions, videoInfo?.videoSize);

    const [previousStatus, setPreviousStatus] = useState<{ paused: boolean }>();

    useAppStatusChange(status => {
      if (Platform.isTV || onTimeChanged) {
        if (status !== 'active') {
          setPreviousStatus({ paused });
          setPaused(true);
        } else {
          previousStatus && setPaused(previousStatus.paused);
        }
      }
    });

    const loaded = (event: VideoInfo) => {
      setLoading(false);
      setVideoInfo(event);
      player.current?.seekTo(position / 1000);
      onLoaded && onLoaded(event);
    };

    const forward = () => {
      videoInfo?.seekable && player.current?.seekTo((progress?.currentTime || 0) / 1000 + seekStep);
    };

    const backward = () => {
      videoInfo?.seekable && player.current?.seekTo((progress?.currentTime || 0) / 1000 - seekStep);
    };

    const seekTo = (value: number) => {
      player.current?.seekTo(value / 1000);
    };

    const togglePlay = () => setPaused(value => !value);

    useImperativeHandle(ref, () => ({
      forward,
      backward,
      seekTo,
      togglePlay,
      videoInfo,
      audioTrack,
      setAudioTrack,
      textTrack,
      setTextTrack
    }));

    useEffect(() => {
      onPaused && onPaused(paused);
    }, [paused]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    onTimeChanged && useDebounceTimeChanged(onTimeChanged, !loading && !paused, progress?.currentTime);

    return (
      <VlcPlayer
        ref={player}
        style={videoSize}
        source={source}
        onProgress={event => {
          setProgress(event);
          onProgress && onProgress(event);
        }}
        onError={onError}
        onLoaded={loaded}
        onEnd={onEnd}
        audioTrack={audioTrack}
        textTrack={textTrack}
      />
    );
  }
);

interface ElementDimensions {
  width: number;
  height: number;
}

const calculateVideoDimensions = (
  windowDimensions: ElementDimensions,
  videoDimensions: ElementDimensions | undefined
): ElementDimensions => {
  'worklet';
  const aspectDimensions = videoDimensions?.height && videoDimensions?.width ? videoDimensions : { width: 16, height: 9 };

  const width = windowDimensions.height * (aspectDimensions.width / aspectDimensions.height);
  const height = windowDimensions.width * (aspectDimensions.height / aspectDimensions.width);

  const dimensions =
    height > windowDimensions.height
      ? {
          width,
          height: windowDimensions.height
        }
      : {
          width: windowDimensions.width,
          height
        };

  return dimensions;
};
