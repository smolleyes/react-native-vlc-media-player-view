import { Button, View } from 'react-native';
import { VideoPlayer } from '../../Player.types';
import { VideoInfo } from '../../VideoView.types';

type ControlsBarProps = {
  player: VideoPlayer;
  videoInfo?: VideoInfo;
};

const seekPad = 60 * 1000;

export const ControlsBar = ({ player, videoInfo }: ControlsBarProps) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#121212',
        opacity: 0.8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        gap: 10,
        padding: 10
      }}
    >
      {videoInfo?.seekable && <Button title="<<" onPress={() => (player.time = player.time - seekPad)} />}

      <Button title={player.paused ? 'play' : 'pause'} onPress={() => player.togglePlay()} />

      {videoInfo?.seekable && <Button title=">>" onPress={() => (player.time = player.time + seekPad)} />}

      <Button title="stop" onPress={() => player.stop()} />
    </View>
  );
};

const toTime = (timeInMillis?: number) => {
  if (timeInMillis && timeInMillis > 0) {
    const timeInSeconds = Math.floor(timeInMillis / 1000);
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${leftPad(hours, 2)}:${leftPad(minutes, 2)}:${leftPad(seconds, 2)}`;
  }
  return '';
};

const leftPad = (value?: number, pad = 2) => (value?.toFixed() || '').padStart(pad, '0');
