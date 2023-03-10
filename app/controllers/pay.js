import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PayController extends Controller {
  @service router;
  @service('api') api;
  @tracked invoice = {};
  @tracked card = {};
  @tracked loading = false;
  @tracked error = null;
  @tracked payInvoiceError = null;
  @tracked processing_error = null;
  @tracked cardNumber_error = null;
  @tracked threed = '';

  invoiceID = null;

  init(){
    super.init(...arguments);
  }

  focus(id){
    document.getElementById(id).focus();
  }

  load = async function (ctx) {
    ctx.invoice = {};
    ctx.loading = true;
    ctx.error = null;
    try {
      var res = await ctx.api.getInvoice(ctx.invoiceID);
      ctx.invoice = res.invoice;
      ctx.loading = false;
      if (ctx.invoice.processing_error) {
        ctx.processing_error = ctx.invoice.processing_error;
      }
      if (ctx.invoice.billing) {
        if (!ctx.invoice.billing.email) {
          ctx.router.transitionTo('email', ctx.invoiceID);
        }
        if (
          (!ctx.invoice.billing.country) ||
          (!ctx.invoice.billing.address) ||
          (!ctx.invoice.billing.zip) ||
          (!ctx.invoice.billing.email) ||
          (!ctx.invoice.billing.first_name) ||
          (!ctx.invoice.billing.last_name)
        ){
          ctx.router.transitionTo('billing', ctx.invoiceID);
        }
      } else {
        ctx.router.transitionTo('email', ctx.invoiceID);
      }
    } catch (e) {
      ctx.invoice = {};
      ctx.loading = false;
      ctx.error = 'Something went wrong!';
    }
  }

  pay = async function(ctx) {
    ctx.cardNumber_error = null;
    if (!ctx.card.number){
      ctx.focus('cardNumber');
      return;
    }
    if ((ctx.card.number.length < 13) || (ctx.card.number.length > 19)){
      ctx.cardNumber_error = "Invalid length of card number!"
      ctx.focus('cardNumber');
      return;
    }
    if (!ctx.card.holder){
      ctx.focus('cardHolder');
      return;
    }
    if (!ctx.card.month){
      ctx.focus('cardExpirationMonth');
      return;
    }
    if (!ctx.card.year){
      ctx.focus('cardExpirationYear');
      return;
    }
    if (!ctx.card.cvv){
      ctx.focus('cardCVV');
      return;
    }
    try{
      ctx.loading = true;
      var res = await ctx.api.charge(ctx.invoiceID, ctx.card);
      if (res.error){
        ctx.payInvoiceError = res.error;
      } else {
        if (res.threed){
          ctx.threed = res.threed;
          setTimeout(function() {
            document.getElementById("threed").submit();
          }, 0);
        } else {
          ctx.payInvoiceError = "3DS Error! Retry!";
        }
      }
      ctx.load(ctx);
    } catch(e) {
      ctx.loading = false;
      ctx.payInvoiceError = "Unexpected Error! (" + e + ")";
    }
  }

  actions = {
    load: async function () {
      this.load(this);
    },
    pay: async function () {
      this.pay(this);
    },
    checkNumber: function(number){
      this.cardNumber_error = null;
      var err = null;
      if (!this.card.number) {
        err = "Should not be empty!"
      }
      if ((this.card.number) && ((this.card.number.length > 19) || (this.card.number.length < 13))) {
        err = "Invalid length!"
      }
      if (err) {
        this.cardNumber_error = err;
      }
      
    },
  };
}
