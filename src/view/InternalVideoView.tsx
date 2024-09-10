import { requireNativeViewManager } from 'expo-modules-core';
import { forwardRef, useState } from 'react';

import { StyleSheet, useWindowDimensions } from 'react-native';
import { VideoInfo, VideoViewProps } from '../VideoView.types';

const RNVideoPlayerView = requireNativeViewManager('VideoPlayerModule');

type InternalVideoViewProps = Omit<VideoViewProps, 'player'> & {
  player: number | null;
};

export const InternalVideoView = forwardRef<any, InternalVideoViewProps>(({ onLoaded, style, ...rest }: InternalVideoViewProps, ref) => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();
  const windowDimensions = useWindowDimensions();
  const videoSize = calculateVideoDimensions(windowDimensions, videoInfo?.videoSize);

  return (
    <RNVideoPlayerView
      onLoaded={(e: { nativeEvent: VideoInfo }) => {
        setVideoInfo(e.nativeEvent);
        onLoaded?.(e);
      }}
      style={[style, videoSize]}
      ref={ref}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

interface ElementDimensions {
  width: number;
  height: number;
}

const calculateVideoDimensions = (
  windowDimensions: ElementDimensions,
  videoDimensions?: ElementDimensions | undefined
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
