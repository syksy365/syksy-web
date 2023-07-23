import React from 'react';
import { PageContainer } from '@ant-design/pro-components';

import { DragDrop,ProgressBar,StatusBar   } from '@uppy/react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';

import '@uppy/core/dist/style.min.css'
import '@uppy/drag-drop/dist/style.min.css'
import '@uppy/progress-bar/dist/style.min.css'
import '@uppy/status-bar/dist/style.min.css'

export default () => {
  const uppy = new Uppy({
    autoProceed: true,
  })
  
  uppy.use(Tus, { 
    endpoint: '/qz/api/file/upload'
  });

  return (
    <PageContainer>
      <ProgressBar uppy={uppy} fixed hideAfterFinish/>
      <StatusBar
        uppy={uppy}
        hideUploadButton
        hideAfterFinish={false}
        showProgressDetails
      />
      <DragDrop
        uppy={uppy}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
            dropHereOr: 'Drop here or %{browse}',
            // Used as the label for the link that opens the system file selection dialog.
            browse: 'browse',
          },
        }}
      />
    </PageContainer>
  );
};
