import * as React from 'react';

import { RNVlcMediaPlayerViewProps } from './RNVlcMediaPlayerView.types';

export default function RNVlcMediaPlayerView(props: RNVlcMediaPlayerViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
