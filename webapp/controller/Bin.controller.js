sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller, UIComponent,JSONModel,MessageToast) => {
    "use strict";
    var oRouter;
    var productName;
    return Controller.extend("com.zdispatchorder.controller.Bin", {
        onInit: function () {
            oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteBin").attachPatternMatched(this.onRouteMatched, this);
        }
        ,

        onRouteMatched: function (oEvent) {
            var that=this;
            productName = oEvent.getParameter("arguments").productName;
            console.log("productName", productName);
            let rackDetails=this.getRackDetailsByProductName(productName);
            let oRackModel=new sap.ui.model.json.JSONModel(
                rackDetails
            )
            console.log("ORackdetails:",oRackModel)
            console.log(that.getView().byId('_IDGenHorizontalLayout'))
            var rackView=this.getView().byId("_IDGenHorizontalLayout").setModel(oRackModel,"oRackModel")

            // var oViewModel = new sap.ui.model.json.JSONModel({
            //     productName: oArgs.productName
            // });
            // this.getView().setModel(oViewModel);
        },
        getRackDetailsByProductName: function (productName) {
            let oModel=this.getView().getModel("WM");
            let data=oModel.oData;
            const pallets = data.warehouse.pallets;
            const rackhouseDetails = data.warehouse.rackhouse_details;

            const filteredPallets = pallets.filter(pallet => pallet.product.product_name === productName);

            const rackDetails = filteredPallets.map(pallet => {
                const rackInfo = rackhouseDetails.find(rack => rack.transfer_order_number === pallet.transfer_order_number);
                return {
                    product_name: pallet.product.product_name,
                    pallet_id: pallet.pallet_id,
                    rack_number: rackInfo ? rackInfo.rack_number : null,
                    date_moved: rackInfo ? rackInfo.date_moved : null
                };
            });
            
            return rackDetails;
        },
        onClickEvent:function(oEvent){
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("oRackModel");
            var binNo = oBindingContext.getProperty("rack_number");
            oRouter.navTo("RouteDispatch",{productName:productName,BinNo:binNo})
        },
        onPressSave:function(oEvent){
            MessageToast.show("Bin Updated!")
        }
    });
});