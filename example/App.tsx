import { StyleSheet, Text, View } from 'react-native';

import * as RNVlcMediaPlayerView from 'react-native-vlc-media-player-view';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{RNVlcMediaPlayerView.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
