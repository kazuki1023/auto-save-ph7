'use client';
import { Ripple, Spinner, useButton } from '@heroui/react';
import { forwardRef } from 'react';

import type { ButtonProps as BaseButtonProps } from '@heroui/button';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ButtonProps extends BaseButtonProps {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    domRef,
    children,
    spinnerSize,
    spinner = <Spinner color="current" size={spinnerSize} />,
    spinnerPlacement,
    startContent,
    endContent,
    isLoading,
    disableRipple,
    getButtonProps,
    getRippleProps,
  } = useButton({
    ref,
    ...props,
  });

  const { ripples, onClear } = getRippleProps();

  return (
    <button ref={domRef} {...getButtonProps()}>
      {startContent}
      {isLoading && spinnerPlacement === 'start' && spinner}
      {children}
      {isLoading && spinnerPlacement === 'end' && spinner}
      {endContent}
      {!disableRipple && <Ripple ripples={ripples} onClear={onClear} />}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
