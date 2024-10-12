import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { LayoutRectangle, StyleSheet, View } from 'react-native';
import { getPlayerId, RNPlayer } from './Player';
import { OnLoadedEvent, OnPausedEvent, OnProgessEvent, ProgressInfo, VideoInfo } from './Player.types';
import { VideoViewProps } from './VideoView.types';
import { Controls, ControlsRef } from './internal/Controls';

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

export type VideoViewRef = {
  showControlBar: (value: boolean) => void;
};

export const VideoView = forwardRef<VideoViewRef | undefined, VideoViewProps>(
  (
    {
      style,
      onLoading,
      onLoaded,
      onPaused,
      onProgress,
      player,
      onBack,
      onPrevious,
      onNext,
      forwardSeconds = 10,
      backwardSeconds = 10,
      ...rest
    }: VideoViewProps,
    ref
  ) => {
    const nativeRef = useRef();
    const playerId = getPlayerId(player);

    const controlRef = useRef<ControlsRef>();

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

    useImperativeHandle(ref, () => ({
      showControlBar: (value: boolean) => controlRef.current?.showControlBar(value)
    }));

    return (
      <View style={[styles.container, style]} onLayout={e => setViewLayout(e.nativeEvent.layout)}>
        <RNPlayer
          ref={nativeRef}
          player={playerId}
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
        <Controls
          ref={controlRef}
          player={player}
          playerObserver={playerObserver}
          onBack={onBack}
          onPrevious={onPrevious}
          onNext={onNext}
          backwardSeconds={backwardSeconds}
          forwardSeconds={forwardSeconds}
        />
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
