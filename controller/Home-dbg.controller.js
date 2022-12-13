sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("lr.de.website.controller.Home", {
		onInit: function () {
			let ObjectPage = this.byId("ObjectPageLayout");
			ObjectPage.setShowFooter(!ObjectPage.getShowFooter());
		}
	});
});