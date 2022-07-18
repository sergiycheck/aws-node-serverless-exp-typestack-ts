import { IVendiaSlsService } from './../src/app/service/vendia-serveless.service';

export class FakeVendiaSlsService implements IVendiaSlsService {
  constructor() {}

  _context: any = {};
  _event: any = {};

  callGetCurrentInvoke() {
    return {
      event: this._event,
      context: this._context,
    };
  }
}
