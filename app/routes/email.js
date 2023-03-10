import Route from '@ember/routing/route';

export default class EmailRoute extends Route {
  async model(params) {
    var invoiceID = params.invoice_id;
    return {
      invoiceID: invoiceID,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('invoiceID', model.invoiceID);
    controller.send('load');
  }
}
