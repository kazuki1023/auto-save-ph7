'use client';

import {
  Card as HeroUICard,
  CardBody as HeroUICardBody,
  CardFooter as HeroUICardFooter,
  CardHeader as HeroUICardHeader,
  type CardProps as BaseCardProps,
  type CardFooterProps as BaseCardFooterProps,
} from '@heroui/react';
import { forwardRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardProps extends BaseCardProps {}

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  return <HeroUICard ref={ref} {...props} />;
});

const CardBody = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    return (
      <HeroUICardBody ref={ref} {...props}>
        {children}
      </HeroUICardBody>
    );
  }
);

const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    return (
      <HeroUICardHeader ref={ref} {...props}>
        {children}
      </HeroUICardHeader>
    );
  }
);

const CardFooter = forwardRef<HTMLDivElement, BaseCardFooterProps>(
  ({ children, ...props }, ref) => {
    return (
      <HeroUICardFooter ref={ref} {...props}>
        {children}
      </HeroUICardFooter>
    );
  }
);

Card.displayName = 'Card';
CardBody.displayName = 'CardBody';
CardHeader.displayName = 'CardHeader';
CardFooter.displayName = 'CardFooter';

export { Card, CardBody, CardFooter, CardHeader };
export default Card;
