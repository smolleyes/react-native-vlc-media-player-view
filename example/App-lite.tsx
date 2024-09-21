import { useState } from 'react';
import { Button, View } from 'react-native';
import { LitePlayerView } from 'react-native-vlc-media-player-view';

export default function App() {
  const [paused, setPaused] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LitePlayerView
        source={{ uri: 'http://apsmart.in/movie/545077210277743/1593574628/137851.mkv', time: 3 * 60 * 1000 }}
        style={{ width: '80%', height: '80%', backgroundColor: 'black' }}
        paused={paused}
      />
      <Button title="play/pause" onPress={() => setPaused(!paused)} />
    </View>
  );
}
