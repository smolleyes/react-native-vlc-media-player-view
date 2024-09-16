import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useVideoPlayer, VideoView } from 'react-native-vlc-media-player-view';

export default function App() {
  const player = useVideoPlayer({}, player => {
    player.source = { uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' };
    player.play();
    player.title = 'Big Buck Bunny 1080p.mp4';
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <MaterialIcons name="play-circle-outline" size={0} color="black" />
      <VideoView
        player={player}
        onLoaded={e => console.log('loaded', e.nativeEvent)}
        onBack={() => console.log('back')}
        onNext={() => console.log('next')}
        onPrevious={() => console.log('previous')}
      />
    </View>
  );
}
