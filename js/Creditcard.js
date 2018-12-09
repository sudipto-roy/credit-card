(function(app){
  CreditCard = function(ccid, formObj, displayText) {
    this.id = ccid;
    this.ccNumber = formObj.ccNumber.value;
    this.ccExpiryMonth = formObj.ccExpiryMonth.value;
    this.ccExpiryYear = formObj.ccExpiryYear.value;
    this.ccType = displayText;
  };
  CreditCard.prototype = {
    save : function(savedCards) {
      app.localDB.setObj(this.id, this);
      app.localDB.setObj('savedCards', savedCards);
      app.createDOMOfThisCard(this.id);
    },
    edit : function() {
      // populate data to form
    },
    delete : function() {
      app.localDB.delete(this.id);
    }
  };
})(window.app = app || {});
