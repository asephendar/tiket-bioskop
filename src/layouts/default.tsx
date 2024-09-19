import type { FC } from 'react';

import { classNames } from '@nxweb/core/strings';
import type { LayoutProps } from '@nxweb/react';
import Navbar from '@components/Fragments/Navbar';

const DefaultLayout: FC<LayoutProps> = ({
  children = null, className
}) => {
  return (
    <div className={classNames('default-layout', className)}>
      <Navbar />
      {children}
    </div>
  );
};

DefaultLayout.displayName = 'DefaultLayout';

export { DefaultLayout };
