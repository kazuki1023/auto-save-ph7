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

const CardBody = ({ children, ...props }: CardBodyProps) => {
  return <HeroUICardBody {...props}>{children}</HeroUICardBody>;
};

const CardHeader = ({ children, ...props }: CardHeaderProps) => {
  return <HeroUICardHeader {...props}>{children}</HeroUICardHeader>;
};

const CardFooter = ({ children, ...props }: CardFooterProps) => {
  return <HeroUICardFooter {...props}>{children}</HeroUICardFooter>;
};

Card.displayName = 'Card';
CardBody.displayName = 'CardBody';
CardHeader.displayName = 'CardHeader';
CardFooter.displayName = 'CardFooter';

export { Card, CardBody, CardFooter, CardHeader };
export default Card;
