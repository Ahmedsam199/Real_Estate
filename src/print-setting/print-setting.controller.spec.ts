import { Test, TestingModule } from '@nestjs/testing';
import { PrintSettingController } from './print-setting.controller';

describe('PrintSettingController', () => {
  let controller: PrintSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintSettingController],
    }).compile();

    controller = module.get<PrintSettingController>(PrintSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
