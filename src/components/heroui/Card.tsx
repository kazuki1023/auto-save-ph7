'use client';

import {
  Card as HeroUICard,
  CardBody as HeroUICardBody,
  CardFooter as HeroUICardFooter,
  CardHeader as HeroUICardHeader,
  type CardProps as BaseCardProps,
} from '@heroui/react';
import { forwardRef, type ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardProps extends BaseCardProps {}

export interface CardBodyProps {
  children?: ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children?: ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children?: ReactNode;
  className?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  return <HeroUICard ref={ref} {...props} />;
});

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(({ children, ...props }, ref) => {
  return <HeroUICardBody ref={ref} {...props}>{children}</HeroUICardBody>;
});

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ children, ...props }, ref) => {
  return <HeroUICardHeader ref={ref} {...props}>{children}</HeroUICardHeader>;
});

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ children, ...props }, ref) => {
  return <HeroUICardFooter ref={ref} {...props}>{children}</HeroUICardFooter>;
});

Card.displayName = 'Card';
CardBody.displayName = 'CardBody';
CardHeader.displayName = 'CardHeader';
CardFooter.displayName = 'CardFooter';

export { Card, CardBody, CardFooter, CardHeader };
export default Card;
