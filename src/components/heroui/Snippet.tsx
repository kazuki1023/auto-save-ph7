'use client';

import { Snippet as HerouiSnippet, SnippetProps } from '@heroui/react';

const Snippet = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  props: SnippetProps;
}) => {
  return (
    <HerouiSnippet {...props} symbol="">
      {children}
    </HerouiSnippet>
  );
};

export default Snippet;
