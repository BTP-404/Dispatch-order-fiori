sap.ui.define(
  [
    "sap/ui/core/Element",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
  ],
  (Element, Controller, UIComponent) => {
    "use strict";
    var oRouter;
    var prefixId;
    var oScanResultText;
    return Controller.extend("com.zdispatchorder.controller.Home", {
      onInit: function () {
        oRouter = UIComponent.getRouterFor(this);
        console.log("Orouter", oRouter);
        prefixId = this.createId();
        if (prefixId) {
          prefixId = prefixId.split("--")[0] + "--";
        } else {
          prefixId = "";
        }
        oScanResultText = Element.getElementById(
          prefixId + "sampleBarcodeScannerResult"
        );
      },
      onClickEvent: function (oEvent) {
        var oItem = oEvent.getSource();
        var oBindingContext = oItem.getBindingContext("WM");
        var sProductName = oBindingContext.getProperty("product/product_name");
        console.log(sProductName);
        oRouter.navTo("RouteBin", { productName: sProductName });
      },
      onScanSuccess: function (oEvent) {
        if (oEvent.getParameter("cancelled")) {
          MessageToast.show("Scan cancelled", { duration: 1000 });
        } else {
          if (oEvent.getParameter("text")) {
            console.log("Scan succeed--", oEvent.getParameter("text"));
            oScanResultText.setText(oEvent.getParameter("text"));
          } else {
            oScanResultText.setText("");
          }
        }
      },

      onScanError: function (oEvent) {
        MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
      },

      onScanLiveupdate: function (oEvent) {
        // User can implement the validation about inputting value
      },
      onAfterRendering: function () {
        // Reset the scan result
        var oScanButton = Element.getElementById(
          prefixId + "sampleBarcodeScannerButton"
        );
        if (oScanButton) {
          $(oScanButton.getDomRef()).on("click", function () {
            oScanResultText.setText("");
          });
        }
      },
    });
  }
);
