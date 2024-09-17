import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useVideoPlayer, VideoView } from 'react-native-vlc-media-player-view';

export default function App() {
  const player = useVideoPlayer();

  const [uri, setUri] = useState<string>('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  useEffect(() => {
    player.play({ uri });
    player.title = 'Big Buck Bunny';
  }, [uri]);

  return (
    <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <MaterialIcons name="play-circle-outline" size={0} color="black" />
      <VideoView
        player={player}
        onLoaded={e => console.log('loaded', e.nativeEvent)}
        onNext={() => console.log('next')}
        onPrevious={() => console.log('previous')}
        onBack={() => console.log('back')}
      />
    </GestureHandlerRootView>
  );
}
