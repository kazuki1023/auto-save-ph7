'use client';

import { Snippet as HerouiSnippet, SnippetProps } from '@heroui/react';

const Snippet = ({
  children,
  ...props
}: SnippetProps & {
  children: React.ReactNode;
}) => {
  return (
    <HerouiSnippet {...props} symbol="">
      {children}
    </HerouiSnippet>
  );
};

export default Snippet;
