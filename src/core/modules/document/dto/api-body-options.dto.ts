import { ApiBodyOptions } from '@nestjs/swagger';

export const UploadDocuemntApiBodyOptions: ApiBodyOptions = {
  schema: {
    type: 'object',
    required: ['file'],
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: 'File to upload',
      },
    },
  },
};
