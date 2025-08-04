'use client';

import {
  Link as HeroUILink,
  type LinkProps as BaseLinkProps,
} from '@heroui/react';
import { forwardRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LinkProps extends BaseLinkProps {}

const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  return <HeroUILink ref={ref} {...props} />;
});

Link.displayName = 'Link';

export default Link;
