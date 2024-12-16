sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], (Controller, UIComponent) => {
    "use strict";
    var oRouter;
    return Controller.extend("com.zdispatchorder.controller.Home", {
        onInit: function () {
            oRouter = UIComponent.getRouterFor(this);
            console.log("Orouter", oRouter);
        },
        onClickEvent: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("WM");
            var sProductName = oBindingContext.getProperty("product/product_name");
            console.log(sProductName);
            oRouter.navTo("RouteBin",{productName:sProductName})
        }
    });
});