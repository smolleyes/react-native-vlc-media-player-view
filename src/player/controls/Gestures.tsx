import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView, PanGesture, TapGesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import VerticalSlider from '../VerticalSlider';
import useBrightness from '../hooks/useBrightness';
import useVolume from '../hooks/useVolume';

type PlayerGestureProps = {
  style?: ViewStyle;
  singleTap?: boolean;
  onToggleShowControls: () => void;
  onTogglePlay?: () => void;
  onBackward?: () => void;
  onForward?: () => void;
  onPriorGesture?: () => void;
};

export const PlayerGestures = ({
  singleTap = true,
  onToggleShowControls,
  onTogglePlay,
  onBackward,
  onForward,
  style,
  onPriorGesture
}: PlayerGestureProps) => {
  const barHeight = useSharedValue<number>(0);

  const [showVolume, setShowVolume] = useState(false);
  const [showBrightness, setShowBrightness] = useState(false);

  const [volume, setVolume] = useVolume();
  const [brightness, setBrightness] = useBrightness();

  const showControlHandler = () =>
    Gesture.Tap()
      .numberOfTaps(1)
      .onEnd(() => runOnJS(onToggleShowControls)())
      .runOnJS(true);

  const togglePlayHandler = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => onTogglePlay && runOnJS(onTogglePlay)())
    .runOnJS(true);

  const backwardHandler = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => onBackward && runOnJS(onBackward)())
    .runOnJS(true);

  const forwardHandler = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => onForward && runOnJS(onForward)())
    .runOnJS(true);

  const volumeHandler = Gesture.Pan()
    .onChange(event => {
      onPriorGesture && onPriorGesture();
      setShowVolume(true);
      runOnJS(setVolume)(calculatePanChangeValue(event.y, 0, 1, 0.1, barHeight.value * 0.5));
    })
    .onEnd(() => setTimeout(() => setShowVolume(false), 1000))
    .runOnJS(true);

  const brightnessHandler = Gesture.Pan()
    .onChange(event => {
      onPriorGesture && onPriorGesture();
      setShowBrightness(true);
      runOnJS(setBrightness)(calculatePanChangeValue(event.y, 0, 1, 0.1, barHeight.value * 0.5));
    })
    .onEnd(() => setTimeout(() => setShowBrightness(false), 1000))
    .runOnJS(true);

  const exclusive = (...gestures: (TapGesture | PanGesture | null)[]) =>
    Gesture.Exclusive(...(gestures.filter(Boolean) as (TapGesture | PanGesture)[]));

  const onBarLayout = (event: LayoutChangeEvent) => (barHeight.value = event.nativeEvent.layout.height);

  return (
    <GestureHandlerRootView style={[styles.container, style]} onLayout={onBarLayout}>
      <GestureDetector gesture={exclusive(backwardHandler, brightnessHandler, (singleTap && showControlHandler()) || null)}>
        <View style={styles.part}>
          {showVolume && (
            <VerticalSlider
              containerStyle={{ height: '60%' }}
              value={volume}
              label="volume"
              labelPosition="right"
              icon={<MaterialIcons name="volume-up" size={30} color="white" />}
            />
          )}
        </View>
      </GestureDetector>
      <GestureDetector gesture={exclusive(togglePlayHandler, (singleTap && showControlHandler()) || null)}>
        <View style={styles.part} />
      </GestureDetector>
      <GestureDetector gesture={exclusive(forwardHandler, volumeHandler, (singleTap && showControlHandler()) || null)}>
        <View style={styles.part}>
          {showBrightness && (
            <VerticalSlider
              containerStyle={{ height: '60%' }}
              value={brightness}
              label="luminosité"
              labelPosition="left"
              icon={<MaterialIcons name="brightness-medium" size={30} color="white" />}
            />
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export const calculatePanChangeValue = (position: number, min: number, max: number, step: number, height: number): number => {
  'worklet';
  const sliderPosition = Math.min(Math.max(height - position, 0), height);
  let value = (sliderPosition / height) * (max - min) + min;
  value = Math.round(value / step) * step;
  value = Math.min(Math.max(value, min), max);
  return value;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  part: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }
});
