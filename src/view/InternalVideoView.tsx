import { forwardRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Player } from '../Player';
import { VideoPlayer } from '../Player.types';
import { VideoInfo, VideoViewProps } from '../VideoView.types';
import { Controls } from './Controls';

type InternalVideoViewProps = Omit<VideoViewProps, 'player'> & {
  player: number | null;
  playerObject: VideoPlayer;
};

export const InternalVideoView = forwardRef<any, InternalVideoViewProps>(
  ({ onLoaded, style, playerObject: player, ...rest }: InternalVideoViewProps, ref) => {
    const [videoInfo, setVideoInfo] = useState<VideoInfo>();
    const windowDimensions = useWindowDimensions();
    const videoSize = calculateVideoDimensions(windowDimensions, videoInfo?.videoSize);

    return (
      <View style={[styles.container, style]}>
        <Player
          onLoaded={(e: { nativeEvent: VideoInfo }) => {
            setVideoInfo(e.nativeEvent);
            onLoaded?.(e);
          }}
          style={videoSize}
          ref={ref}
          {...rest}
        />
        <Controls player={player} videoInfo={videoInfo} />
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
