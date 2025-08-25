import { Test, TestingModule } from '@nestjs/testing';
import { PrintSettingService } from './print-setting.service';

describe('PrintSettingService', () => {
  let service: PrintSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintSettingService],
    }).compile();

    service = module.get<PrintSettingService>(PrintSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
