import { forwardRef, useState } from 'react';
import { LayoutRectangle, StyleSheet, View } from 'react-native';

import { RNPlayer } from '../Player';
import { OnLoadedEvent, OnPausedEvent, OnProgessEvent, ProgressInfo, VideoInfo, VideoPlayer } from '../Player.types';
import { VideoViewProps } from '../VideoView.types';
import { Controls } from './Controls';

export type InternalVideoViewProps = Omit<VideoViewProps, 'player'> & {
  player: number | null;
  playerObject: VideoPlayer;
};

type LoadingListener = () => void;
type LoadedListener = (event: VideoInfo) => void;
type PausedListener = (event: boolean) => void;
type ProgressListener = (event: ProgressInfo) => void;

export type VideoPlayerEventsObserver = {
  addEventListener: (listener: VideoPlayerListener) => void;
  removeEventListener: (listener: VideoPlayerListener) => void;
};

export type VideoPlayerListener = {
  onLoading?: LoadingListener;
  onLoaded?: LoadedListener;
  onPaused?: PausedListener;
  onProgress?: ProgressListener;
};

export const InternalVideoView = forwardRef<any, InternalVideoViewProps>(
  (
    { style, onLoading, onLoaded, onPaused, onProgress, playerObject, onBack, onPrevious, onNext, ...rest }: InternalVideoViewProps,
    ref
  ) => {
    const [videoInfo, setVideoInfo] = useState<VideoInfo>();
    const [progressInfo, setProgressInfo] = useState<ProgressInfo>();
    const [viewLayout, setViewLayout] = useState<LayoutRectangle>();
    const videoSize = calculateVideoDimensions(viewLayout, videoInfo?.videoSize);

    const [listeners] = useState<VideoPlayerListener[]>([]);

    const playerObserver: VideoPlayerEventsObserver = {
      addEventListener: listener => {
        const isExist = listeners.includes(listener);
        if (!isExist) {
          listeners.push(listener);
          videoInfo && listeners.forEach(listener => listener.onLoaded?.(videoInfo));
          progressInfo && listeners.forEach(listener => listener.onProgress?.(progressInfo));
        }
      },
      removeEventListener: listener => {
        const observerIndex = listeners.indexOf(listener);
        if (observerIndex !== -1) {
          listeners.splice(observerIndex, 1);
        }
      }
    };

    return (
      <View style={[styles.container, style]} onLayout={e => setViewLayout(e.nativeEvent.layout)}>
        <RNPlayer
          ref={ref}
          style={videoSize}
          onLoading={() => {
            listeners.forEach(listener => listener.onLoading?.());
            onLoading?.();
          }}
          onLoaded={(e: OnLoadedEvent) => {
            setVideoInfo(e.nativeEvent);
            listeners.forEach(listener => listener.onLoaded?.(e.nativeEvent));
            onLoaded?.(e);
          }}
          onPaused={(e: OnPausedEvent) => {
            listeners.forEach(listener => listener.onPaused?.(e.nativeEvent.payload));
            onPaused?.(e);
          }}
          onProgress={(e: OnProgessEvent) => {
            setProgressInfo(e.nativeEvent);
            listeners.forEach(listener => listener.onProgress?.(e.nativeEvent));
            onProgress?.(e);
          }}
          {...rest}
        />
        <Controls player={playerObject} playerObserver={playerObserver} onBack={onBack} onPrevious={onPrevious} onNext={onNext} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

interface ElementDimensions {
  width: number;
  height: number;
}

const calculateVideoDimensions = (parentLayout?: LayoutRectangle, videoDimensions?: ElementDimensions | undefined): ElementDimensions => {
  'worklet';
  const aspectDimensions = videoDimensions?.height && videoDimensions?.width ? videoDimensions : { width: 16, height: 9 };
  const parentDimensions = parentLayout || { width: 16, height: 9 };

  const width = parentDimensions.height * (aspectDimensions.width / aspectDimensions.height);
  const height = parentDimensions.width * (aspectDimensions.height / aspectDimensions.width);

  const dimensions =
    height > parentDimensions.height
      ? {
          width,
          height: parentDimensions.height
        }
      : {
          width: parentDimensions.width,
          height
        };

  return dimensions;
};
