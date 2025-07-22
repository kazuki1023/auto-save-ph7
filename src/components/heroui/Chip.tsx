'use client';

import { Chip as HerouiChip, ChipProps } from '@heroui/react';

const Chip = ({ children, ...props }: ChipProps) => {
  return <HerouiChip {...props}>{children}</HerouiChip>;
};

export default Chip;
