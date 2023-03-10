import config from '../config/environment';
import Service from '@ember/service';

export default class ApiService extends Service {

  async charge(invoiceID, data) {
    return await this.post('/pay/invoices/' + invoiceID + '/charge', {
      card: data,
      device: {
        screen_height: $(window).height(),
        screen_width: $(window).width(),
        time_zone: (- (new Date()).getTimezoneOffset() / 60),
      },
    });
  }

  async updateBilling(invoiceID, data) {
    return await this.post('/pay/invoices/' + invoiceID + '/billing', {
      billing: data,
    });
  }

  async checkCode(invoiceID, code) {
    return await this.post('/pay/invoices/' + invoiceID + '/mailer/check', {
      code: code,
    });
  }

  async requestCode(invoiceID, email) {
    return await this.post('/pay/invoices/' + invoiceID + '/mailer/request', {
      email: email,
    });
  }

  async resetEmail(invoiceID, email) {
    return await this.post('/pay/invoices/' + invoiceID + '/mailer/reset', {});
  }

  async getInvoice(invoiceID) {
    return await this.get('/pay/invoices/' + invoiceID);
  }

  async get(endpoint) {
    var parsed_data = await this.req('GET', endpoint);
    return parsed_data;
  }

  async post(endpoint, data) {
    var parsed_data = await this.req('POST', endpoint, data);
    return parsed_data;
  }

  async req(method, endpoint, data) {
    var r = {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      r.body = JSON.stringify(data);
    }
    var response = await fetch(config.backendURL + endpoint, r);
    var parsed = await response.json();
    return parsed.data;
  }
}
