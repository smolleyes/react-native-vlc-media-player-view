import { PlayerViewProps } from './Player.types';

export type VideoViewProps = PlayerViewProps & {
  onBack?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  backwardSeconds?: number;
  forwardSeconds?: number;
};
