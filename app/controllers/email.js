import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class EmailController extends Controller {
  @service router;
  @service('api') api;
  @tracked invoice = {};
  @tracked mailer = {};
  @tracked invoicestr;
  @tracked loading = false;
  @tracked error = null;
  @tracked email_error = null;
  @tracked code_error = null;
  @tracked email_code_sent = false;

  @tracked code1 = undefined;
  @tracked code2 = undefined;
  @tracked code3 = undefined;
  @tracked code4 = undefined;
  @tracked code5 = undefined;
  @tracked code6 = undefined;

  invoiceID = null;

  focus(num){
    document.getElementById('code' + num + 'Input').focus();
  }

  init(){
    super.init(...arguments);

    this.addObserver('code1', (e) => {
      if (this.code1){
        if (isNaN(this.code1)) { this.code1 = undefined; return; }
        if (this.code1.length > 1) { this.code1 = this.code1[0]; return; }
        if (parseInt(this.code1) > 9) { this.code1 = 9; return; }
        if (parseInt(this.code1) < 0) { this.code1 = 0; return; }
        this.focus(2);
      }
    });
    this.addObserver('code2', (e) => {
      if (this.code2){
        if (isNaN(this.code2)) { this.code2 = undefined; return; }
        if (this.code2.length > 1) { this.code2 = this.code2[0]; return; }
        if (parseInt(this.code2) > 9) { this.code2 = 9; return; }
        if (parseInt(this.code2) < 0) { this.code2 = 0; return; }
        this.focus(3);
      }
    });
    this.addObserver('code3', (e) => {
      if (this.code3){
        if (isNaN(this.code3)) { this.code3 = undefined; return; }
        if (this.code3.length > 1) { this.code3 = this.code3[0]; return; }
        if (parseInt(this.code3) > 9) { this.code3 = 9; return; }
        if (parseInt(this.code3) < 0) { this.code3 = 0; return; }
        this.focus(4);
      }
    });
    this.addObserver('code4', (e) => {
      if (this.code4){
        if (isNaN(this.code4)) { this.code4 = undefined; return; }
        if (this.code4.length > 1) { this.code4 = this.code4[0]; return; }
        if (parseInt(this.code4) > 9) { this.code4 = 9; return; }
        if (parseInt(this.code4) < 0) { this.code4 = 0; return; }
        this.focus(5);
      }
    });
    this.addObserver('code5', (e) => {
      if (this.code5){
        if (isNaN(this.code5)) { this.code5 = undefined; return; }
        if (this.code5.length > 1) { this.code5 = this.code5[0]; return; }
        if (parseInt(this.code5) > 9) { this.code5 = 9; return; }
        if (parseInt(this.code5) < 0) { this.code5 = 0; return; }
        this.focus(6);
      }
    });
    this.addObserver('code6', (e) => {
      if (this.code6){
        if (isNaN(this.code6)) { this.code6 = undefined; return; }
        if (this.code6.length > 1) { this.code6 = this.code6[0]; return; }
        if (parseInt(this.code6) > 9) { this.code6 = 9; return; }
        if (parseInt(this.code6) < 0) { this.code6 = 0; return; }
      }
    });
  }

  load = async function(ctx){
    ctx.invoice = {};
    ctx.loading = true;
    ctx.error = null;
    try {
      var res = await ctx.api.getInvoice(ctx.invoiceID);
      if (!res.invoice.billing) {
        res.invoice.billing = {};
      }
      ctx.invoice = res.invoice;
      ctx.mailer = res.mailer;
      ctx.loading = false;

      if (ctx.invoice.billing.email) {
        if (
          (!res.invoice.billing.country) ||
          (!res.invoice.billing.address) ||
          (!res.invoice.billing.zip) ||
          (!res.invoice.billing.email) ||
          (!res.invoice.billing.first_name) ||
          (!res.invoice.billing.last_name)
        ){
          ctx.router.transitionTo('billing', ctx.invoiceID);
        }
      }
    } catch (e) {
      ctx.invoice = {};
      ctx.loading = false;
      ctx.error = e;
    }
  };

  code = function(ctx){
    if (!ctx.code1 == undefined){ ctx.focus(1); return; }
    if (!ctx.code2 == undefined){ ctx.focus(2); return; }
    if (!ctx.code3 == undefined){ ctx.focus(3); return; }
    if (!ctx.code4 == undefined){ ctx.focus(4); return; }
    if (!ctx.code5 == undefined){ ctx.focus(5); return; }
    if (!ctx.code6 == undefined){ ctx.focus(6); return; }
    var code = ctx.code1.toString() +
               ctx.code2.toString() +
               ctx.code3.toString() +
               ctx.code4.toString() +
               ctx.code5.toString() +
               ctx.code6.toString();
    return code;
  }

  continue = async function(ctx){
    if (
      (ctx.invoice.billing.email_pending) &&
      (ctx.mailer.code_present)
    ) {
      await ctx.checkCode(ctx);
    } else {
      await ctx.requestCode(ctx);
    }
  }

  checkCode = async function(ctx){
    if (ctx.loading) return;
    var code = ctx.code(ctx);
    if (!code) {
      return;
    }
    ctx.loading = true;
    var res = await ctx.api.checkCode(ctx.invoiceID, code);
    if (res.error) {
      ctx.code_error = res.error;
      ctx.loading = false;
    } else {
      await ctx.load(ctx);
    }
  }

  requestCode = async function(ctx){
    if (ctx.loading) return;
    var email = ctx.invoice.billing.email_pending;
    if (!email){
      document.getElementById('emailInput').focus();
      return;
    }
    ctx.loading = true;
    var res = await ctx.api.requestCode(ctx.invoiceID, email);
    if (res.error) {
      ctx.code_error = res.error;
      ctx.loading = false;
    } else {
      await ctx.load(ctx);
    }
  }

  resetEmail = async function(ctx){
    if (ctx.loading) return;
    ctx.loading = true;
    await ctx.api.resetEmail(ctx.invoiceID);
    await ctx.load(ctx);
  }

  actions = {
    load: async function(){
      this.load(this);
    },
    continue: async function(){
      this.continue(this);
    },
    requestCode: async function(){
      this.requestCode(this);
    },
    resetEmail: async function(){
      this.resetEmail(this);
    },

    // INPUT 1
    code1InputFocusIn: function(){
      $('#code1Input').select();
    },
    code1InputFocusOut: function(){},
    code1InputKeyDown: function(){
      var self = this;
      var key = event.keyCode || event.charCode;
      if (event.ctrlKey || event.metaKey || key == 9) { return; }
      if (key == 8 || key == 46){ setTimeout(function(){ self.code1 = undefined; }); this.focus(1); event.preventDefault(); event.stopPropagation(); return; }

      if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
        // 0-9 only
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    code1InputPaste: function(){
      var self = this;
      event.preventDefault();
      var paste = (event.clipboardData || window.clipboardData).getData('text');
      if (paste.length == 6){
        this.code1 = parseInt(paste[0]);
        this.code2 = parseInt(paste[1]);
        this.code3 = parseInt(paste[2]);
        this.code4 = parseInt(paste[3]);
        this.code5 = parseInt(paste[4]);
        this.code6 = parseInt(paste[5]);

        setTimeout(function(){
          self.focus(6);
        });
      }
    },

    code2InputFocusIn: function(){
      $('#code2Input').select();
    },
    code2InputFocusOut: function(){},
    code2InputKeyDown: function(){
      var self = this;
      var key = event.keyCode || event.charCode;
      if (event.ctrlKey || event.metaKey || key == 9) { return; }
      if (key == 8 || key == 46){ setTimeout(function(){ self.code2 = undefined; }); this.focus(1); event.preventDefault(); event.stopPropagation(); return; }
      if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
        // 0-9 only
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    code2InputPaste: function(){
      event.preventDefault();
    },

    code3InputFocusIn: function(){
      $('#code3Input').select();
    },
    code3InputFocusOut: function(){},
    code3InputKeyDown: function(){
      var self = this;
      var key = event.keyCode || event.charCode;
      if (event.ctrlKey || event.metaKey || key == 9) { return; }
      if (key == 8 || key == 46){ setTimeout(function(){ self.code3 = undefined; }); this.focus(2); event.preventDefault(); event.stopPropagation(); return; }
      if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
        // 0-9 only
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    code3InputPaste: function(){
      event.preventDefault();
    },

    code4InputFocusIn: function(){
      $('#code4Input').select();
    },
    code4InputFocusOut: function(){},
    code4InputKeyDown: function(){
      var self = this;
      var key = event.keyCode || event.charCode;
      if (event.ctrlKey || event.metaKey || key == 9) { return; }
      if (key == 8 || key == 46){ setTimeout(function(){ self.code4 = undefined; }); this.focus(3); event.preventDefault(); event.stopPropagation(); return; }
      if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
        // 0-9 only
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    code4InputPaste: function(){
      event.preventDefault();
    },

    code5InputFocusIn: function(){
      $('#code5Input').select();
    },
    code5InputFocusOut: function(){},
    code5InputKeyDown: function(){
      var self = this;
      var key = event.keyCode || event.charCode;
      if (event.ctrlKey || event.metaKey || key == 9) { return; }
      if (key == 8 || key == 46){ setTimeout(function(){ self.code5 = undefined; }); this.focus(4); event.preventDefault(); event.stopPropagation(); return; }
      if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
        // 0-9 only
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    code5InputPaste: function(){
      event.preventDefault();
    },

    code6InputFocusIn: function(){
      $('#code6Input').select();
    },
    code6InputFocusOut: function(){},
    code6InputKeyDown: function(){
      var self = this;
      var key = event.keyCode || event.charCode;
      if (event.ctrlKey || event.metaKey || key == 9) { return; }
      if (key == 8 || key == 46){ setTimeout(function(){ self.code6 = undefined; }); this.focus(5); event.preventDefault(); event.stopPropagation(); return; }
      if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
        // 0-9 only
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    code6InputPaste: function(){
      event.preventDefault();
    },
  };
}
