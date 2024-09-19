import { LayoutRegistry } from '@nxweb/react';

import { DefaultLayout } from '@layouts/default.js';
import { Kosong } from '@layouts/kosong';

export const layouts: LayoutRegistry = new LayoutRegistry({
  default: DefaultLayout,
  kosong: Kosong
});
