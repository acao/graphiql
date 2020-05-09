/** @jsx jsx */

import { jsx, SxStyleProp } from 'theme-ui';
import * as React from 'react';

export default function EditorWrapper(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    sx?: SxStyleProp;
    innerRef: any;
  },
) {
  return (
    <div
      {...props}
      ref={props.innerRef}
      sx={{
        height: '100%',
        ...props.sx,
      }}
    />
  );
}
