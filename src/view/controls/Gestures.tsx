import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

type ControlsProps = {
  onSingleTap: () => void;
  onDoubleTapCenter: () => void;
  onDoubleTapLeft: () => void;
  onDoubleTapRight: () => void;
  onVerticalSlideLeft: (delta: number) => void;
  onVerticalSlideLeftEnd: () => void;
  onVerticalSlideRight: (delta: number) => void;
  onVerticalSlideRightEnd: () => void;
};

export const ControlsGestures = ({
  onSingleTap,
  onDoubleTapCenter,
  onDoubleTapLeft,
  onDoubleTapRight,
  onVerticalSlideLeft,
  onVerticalSlideLeftEnd,
  onVerticalSlideRight,
  onVerticalSlideRightEnd
}: ControlsProps) => {
  const barHeight = useSharedValue<number>(0);

  const [initialVerticalSlideLeftPositionY, setInitialVerticalSlideLeftPositionY] = useState(0);
  const [initialVerticalSlideRightPositionY, setInitialVerticalSlideRightPositionY] = useState(0);

  const showControlHandler = () =>
    Gesture.Tap()
      .numberOfTaps(1)
      .onEnd(() => runOnJS(onSingleTap)())
      .runOnJS(true);

  const togglePlayHandler = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => runOnJS(onDoubleTapCenter)())
    .runOnJS(true);

  const backwardHandler = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => runOnJS(onDoubleTapLeft)())
    .runOnJS(true);

  const forwardHandler = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => runOnJS(onDoubleTapRight)())
    .runOnJS(true);

  const verticalSlideRight = Gesture.Pan()
    .onBegin(event => setInitialVerticalSlideLeftPositionY(event.y))
    .onChange(event => {
      runOnJS(onVerticalSlideRight)(calculatePanChangeDelta(event.y, initialVerticalSlideLeftPositionY, barHeight.value));
      setInitialVerticalSlideLeftPositionY(event.y);
    })
    .onEnd(() => setTimeout(onVerticalSlideRightEnd, 1000))
    .runOnJS(true);

  const brightnessHandler = Gesture.Pan()
    .onBegin(event => setInitialVerticalSlideRightPositionY(event.y))
    .onChange(event => {
      runOnJS(onVerticalSlideLeft)(calculatePanChangeDelta(event.y, initialVerticalSlideRightPositionY, barHeight.value));
      setInitialVerticalSlideRightPositionY(event.y);
    })
    .onEnd(() => setTimeout(onVerticalSlideLeftEnd, 1000))
    .runOnJS(true);

  const onBarLayout = (event: LayoutChangeEvent) => (barHeight.value = event.nativeEvent.layout.height);

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onBarLayout}>
      <GestureDetector gesture={Gesture.Exclusive(backwardHandler, brightnessHandler, showControlHandler())}>
        <View style={styles.part}></View>
      </GestureDetector>
      <GestureDetector gesture={Gesture.Exclusive(togglePlayHandler, showControlHandler())}>
        <View style={styles.part}></View>
      </GestureDetector>
      <GestureDetector gesture={Gesture.Exclusive(forwardHandler, verticalSlideRight, showControlHandler())}>
        <View style={styles.part}></View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export const calculatePanChangeDelta = (position: number, initialPosition: number, relativeHeight: number): number => {
  'worklet';
  return (initialPosition - position) / (relativeHeight * 0.5);
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
