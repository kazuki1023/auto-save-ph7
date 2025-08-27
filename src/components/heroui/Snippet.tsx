'use client';

import { Snippet as HerouiSnippet, SnippetProps } from '@heroui/react';

const Snippet = ({
  children,
  className = '',
  ...props
}: SnippetProps & {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <HerouiSnippet
        {...props}
        symbol=""
        className={`w-full max-w-full ${className}`}
        classNames={{
          base: 'w-full max-w-full overflow-hidden',
          content:
            'truncate w-full max-w-full block overflow-hidden text-ellipsis whitespace-nowrap',
          pre: 'truncate w-full max-w-full overflow-hidden',
          ...props.classNames,
        }}
        tooltipProps={{
          isDisabled: true,
        }}
      >
        <span className="truncate block w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {children}
        </span>
      </HerouiSnippet>
    </div>
  );
};

export default Snippet;
