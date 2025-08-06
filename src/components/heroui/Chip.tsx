'use client';

import {
  Chip as HeroUIChip,
  type ChipProps as BaseChipProps,
} from '@heroui/react';
import { forwardRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ChipProps extends BaseChipProps {}

const Chip = forwardRef<HTMLDivElement, ChipProps>((props, ref) => {
  return <HeroUIChip ref={ref} {...props} />;
});

Chip.displayName = 'Chip';

export default Chip;
