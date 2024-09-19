import type { PageComponent } from '@nxweb/react';
import IndexLayout from '@layouts/IndexLayout';
import { DefaultLayout } from '@layouts/default';

const Index: PageComponent = () => {
  return (
    <>
      {/* <DefaultLayout> */}
        <IndexLayout />
      {/* </DefaultLayout> */}
    </>
  );
};

Index.displayName = 'Index';

// // Index.layout = 'default';
// // Index.title = 'Home';

export default Index;
