import { MaterialIcons } from '@expo/vector-icons';
import { IconButtonProps } from '@expo/vector-icons/build/createIconSet';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useVideoPlayer, VideoView } from 'react-native-vlc-media-player-view';

export default function App() {
  const player = useVideoPlayer({}, player => {
    player.title = 'Size is adapted to parent layout';
  });

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        gap: 20,
        padding: 10,
        backgroundColor: '#121212'
      }}
    >
      <View style={{ flex: 0, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
        <Text style={{ color: 'white' }}>Select a video: </Text>

        <Button
          title="mkv"
          onPress={() => player.play({ uri: 'https://sample-videos.com/video321/mkv/720/big_buck_bunny_720p_30mb.mkv' })}
        />

        <Button
          title="mp4"
          onPress={() => player.play({ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' })}
        />

        <Button
          title="4K"
          onPress={() => player.play({ uri: 'https://videos.pexels.com/video-files/28237488/12335970_2560_1440_24fps.mp4' })}
        />

        <Button
          title="vertical"
          onPress={() => player.play({ uri: 'https://videos.pexels.com/video-files/27065199/12061858_1440_2560_60fps.mp4' })}
        />
      </View>
      <VideoView
        player={player}
        style={{ flex: 1, width: '80%' }}
        onLoaded={e => console.log('loaded', e.nativeEvent)}
        onNext={() => console.log('next')}
        onPrevious={() => console.log('previous')}
        onBack={() => console.log('back')}
      />
    </GestureHandlerRootView>
  );
}

type ButtonProps = Omit<IconButtonProps<string>, 'name'> & {
  title: string;
};

const Button = ({ title, ...props }: ButtonProps) => {
  return (
    <MaterialIcons.Button name="play-circle-filled" size={20} {...props}>
      {title}
    </MaterialIcons.Button>
  );
};
