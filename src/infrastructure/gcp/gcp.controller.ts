import { Controller } from '@nestjs/common';
import { GcpService } from './gcp.service';

@Controller('gcp')
export class GcpController {
  constructor(private readonly gcpService: GcpService) {}
}
