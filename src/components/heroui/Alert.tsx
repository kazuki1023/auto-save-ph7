'use client';
import { forwardRef } from 'react';

// HeroUIにAlertコンポーネントがない場合は、カスタム実装
export interface AlertProps {
  children: React.ReactNode;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  variant?: 'flat' | 'bordered' | 'faded' | 'solid';
  className?: string;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isClosable?: boolean;
  onClose?: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      color = 'default',
      variant = 'flat',
      className = '',
      radius = 'md',
      startContent,
      endContent,
      isClosable = false,
      onClose,
      ...props
    },
    ref
  ) => {
    const colorClasses = {
      default: 'bg-default-100 text-default-800 border-default-200',
      primary: 'bg-primary-100 text-primary-800 border-primary-200',
      secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200',
      success: 'bg-success-100 text-success-800 border-success-200',
      warning: 'bg-warning-100 text-warning-800 border-warning-200',
      danger: 'bg-danger-100 text-danger-800 border-danger-200',
    };

    const variantClasses = {
      flat: '',
      bordered: 'border-2',
      faded: 'border border-opacity-50',
      solid: 'text-white',
    };

    const radiusClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    return (
      <div
        ref={ref}
        className={`
          flex items-center gap-2 p-3
          ${colorClasses[color]}
          ${variantClasses[variant]}
          ${radiusClasses[radius]}
          ${className}
        `}
        {...props}
      >
        {startContent && <div className="flex-shrink-0">{startContent}</div>}
        <div className="flex-1">{children}</div>
        {endContent && <div className="flex-shrink-0">{endContent}</div>}
        {isClosable && onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
