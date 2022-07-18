import { Service } from 'typedi';

export interface IVendiaSlsService {
  getCurrentInvoke(): { event: any; context: any };
}

@Service()
export class VendiaSlsService implements IVendiaSlsService {
  constructor() {}

  getCurrentInvoke() {
    const { event, context } = this.getCurrentInvoke();

    return {
      event,
      context,
    };
  }
}
