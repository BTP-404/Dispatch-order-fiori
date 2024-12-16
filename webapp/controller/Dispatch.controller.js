sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller, UIComponent, JSONModel,MessageToast) => {
    "use strict";
    var oRouter;
    var productName ;
    var rackNo ;


    return Controller.extend("com.zdispatchorder.controller.Dispatch", {
        onInit: function () {
            this.selectedTiles = [];
            oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteDispatch").attachPatternMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
            rackNo = oEvent.getParameter("arguments").BinNo;
            productName = oEvent.getParameter("arguments").productName;
            console.log("RackNo", rackNo);
            
            var cartoonDetails = this.findCartonsByBinNo(rackNo);
            console.log("CartoonDetails--", cartoonDetails);
            
            var oCartoonModel = new JSONModel(cartoonDetails);
            this.getView().byId("_IDGenHorizontalLayout2").setModel(oCartoonModel, "oCartoonModel");
        },

        findCartonsByBinNo: function (binNo) {
            let cartonsArray = [];
            var warehouseData = this.getView().getModel("WM").getData();
            
            warehouseData.warehouse.pallets.forEach(pallet => {
                if (pallet.rack_number === binNo) {
                    pallet.product.cartons.forEach(carton => {
                        cartonsArray.push({ "carton_number": carton.carton_number });
                    });
                }
            });
            return cartonsArray;
        },

        onCheckboxSelect: function (oEvent) {
            var selectedCartonNumber = oEvent.getSource().getParent().getBindingContext("oCartoonModel").getObject().carton_number;
            // console.log(selectedCartonNumber)
            var oCartoonModel = this.getView().byId("_IDGenHorizontalLayout2").getModel("oCartoonModel");
            var selectedCartons = oCartoonModel.getData();
            console.log("sddsd",selectedCartons)

            if (Array.isArray(selectedCartons)) {
                if (oEvent.getParameter("selected")) {
                    var selectedTileIndex = selectedCartons.findIndex(tile => tile.carton_number === selectedCartonNumber);
                    if (selectedTileIndex > -1) {
                        selectedCartons.push(selectedCartons.splice(selectedTileIndex, 1)[0]);
                    }
                }
            }
        },
        onPressSave:function (oEvent) {
            MessageToast.show("Items Dispatched!");
            oRouter.navTo("RouteBin",{productName:productName})
            
        }
    });
});
