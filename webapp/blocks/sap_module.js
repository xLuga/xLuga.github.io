sap.ui.define([
	"sap/ui/core/library", 
    'sap/uxap/BlockBase'
], function(
	coreLibrary,
    BlockBase
) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var GoalsBlock = BlockBase.extend("lr.de.website.blocks.sap_module", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "lr.de.website.blocks.sap_module",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "lr.de.website.blocks.sap_module",
					type: ViewType.XML
				}
			}
		}
	});
	return GoalsBlock;
});