import EmberRouter from '@ember/routing/router';
import config from 'embily-pay-frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('pay', { path: '/i/:invoice_id' });
  this.route('email', { path: '/i/:invoice_id/email' });
  this.route('billing', { path: '/i/:invoice_id/billing' });
});
