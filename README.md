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

## Example

```tsx
import { useVideoPlayer, VideoView } from 'react-native-vlc-media-player-view';

export default function App() {
  const player = useVideoPlayer({}, player => {
    player.source = { uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' };
    player.play();
  });

  return <VideoView player={player} />;
}
```

## Usage

Look at types definition.
