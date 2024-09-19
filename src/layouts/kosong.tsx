import type { FC } from 'react';

import { classNames } from '@nxweb/core/strings';
import type { LayoutProps } from '@nxweb/react';
import Navbar from '@components/Fragments/Navbar';

const Kosong: FC<LayoutProps> = ({
    children = null
}) => {
    return (
        <div >
            {/* <Navbar /> */}
            {children}
        </div>
    );
};

// Kosong.displayName = 'Kosong';

export { Kosong };
