import type { Configuration } from '@nxweb/builder';

export default {
  html: {
    /*
     * TODO: remove when issue is resolved
     *
     * build with sri fails when resource name contains percent encoded character
     * see: https://github.com/waysact/webpack-subresource-integrity/issues/221
     */
    sri: false
  }
} as Configuration;
