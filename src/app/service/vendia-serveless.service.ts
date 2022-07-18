import { Service } from 'typedi';
import { getCurrentInvoke } from '@vendia/serverless-express';

export interface IVendiaSlsService {
  callGetCurrentInvoke(): { event: any; context: any };
}

@Service()
export class VendiaSlsService implements IVendiaSlsService {
  constructor() {}

  callGetCurrentInvoke() {
    const { event, context } = getCurrentInvoke();

    return {
      event,
      context,
    };
  }
}
