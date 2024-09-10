# react-native-vlc-media-player-view

React Native VLC media player view with full controls 🚧.

Use the latest libvlc library version!

```gradle
dependencies {
    implementation 'org.videolan.android:libvlc-all:4.0.0-eap15'
}
```

## Installation

```sh
npm install react-native-vlc-media-player-view
```

## Usage

```tsx
<VlcPlayer
  ref={player}
  style={videoSize}
  source={{ uri, autoplay: true }}
  paused={paused}
  onLoaded={loaded}
  onProgress={onProgress}
  onEnd={onEnd}
  onError={onError}
  audioTrack={audioTrack}
  textTrack={textTrack}
/>
```

## Example

```tsx
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { PlayerRef, VideoInfo, VlcPlayer } from 'react-native-vlc-media-player-view';

export default function App() {
  const playerRef = useRef<PlayerRef>(null);

  const [videoInfo, setVideoInfo] = useState<VideoInfo>();
  const windowDimensions = useWindowDimensions();
  const videoSize = calculateVideoDimensions(windowDimensions, videoInfo?.videoSize);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.seekTo(50 * 1000);
    }
  }, [playerRef.current]);

  return (
    <View style={styles.container}>
      <VlcPlayer
        ref={playerRef}
        source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
        onLoaded={setVideoInfo}
        style={videoSize}
      />
    </View>
  );
}

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
```
