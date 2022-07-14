import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

export class ReturnedDataModifier implements InterceptorInterface {
  intercept(action: Action, content: any) {
    content['addedProp'] = {
      data: 'useful data',
    };

    return content;
  }
}
