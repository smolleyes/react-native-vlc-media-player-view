import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { VideoPlayer } from '../../Player.types';

type DelayViewProps = {
  player: VideoPlayer;
  onClose: () => void;
};

export const AudioDelayView = ({ player, onClose }: DelayViewProps) => {
  const [delay, setDelay] = useState(player.audioDelay);

  useEffect(() => {
    player.audioDelay = delay;
  }, [delay]);

  return (
    <View style={styles.container}>
      <View style={styles.part}>
        <Text style={{ color: '#ff8c00', fontSize: 14, flex: 1, textAlign: 'center', fontWeight: 'bold' }}>Décalage audio</Text>
        <TouchableWithoutFeedback onPress={onClose}>
          <MaterialIcons name="close" size={30} color="white" style={{ paddingHorizontal: 10 }} />
        </TouchableWithoutFeedback>
      </View>
      <View style={[styles.part, { justifyContent: 'space-around', paddingVertical: 10 }]}>
        <TouchableWithoutFeedback onPress={() => setDelay(delay => delay - 50)}>
          <MaterialIcons name="arrow-back-ios-new" size={25} color="white" style={{ paddingHorizontal: 20 }} />
        </TouchableWithoutFeedback>
        <Text style={{ color: 'white', fontSize: 20 }}>{delay} ms</Text>
        <TouchableWithoutFeedback onPress={() => setDelay(delay => delay + 50)}>
          <MaterialIcons name="arrow-forward-ios" size={30} color="white" style={{ paddingHorizontal: 20 }} />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.part}>
        <TouchableWithoutFeedback onPress={() => setDelay(0)}>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              flex: 1,
              textAlign: 'right',
              fontWeight: 'bold',
              paddingHorizontal: 20,
              paddingVertical: 5
            }}
          >
            Réinitialiser
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    width: 300,
    gap: 5
  },
  part: {
    backgroundColor: 'rgba(12,12,12,0.8)',
    padding: 2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  }
});
