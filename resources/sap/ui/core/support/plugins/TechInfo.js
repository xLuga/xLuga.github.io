/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/util/isEmptyObject","sap/base/util/isPlainObject","../Plugin","../Support","../ToolsAPI","sap/base/security/encodeXML"],function(e,t,o,r,i,a,s){"use strict";var n=r.extend("sap.ui.core.support.plugins.TechInfo",{constructor:function(e){r.apply(this,["sapUiSupportTechInfo","Technical Information",e]);this._aEventIds=this.runsAsToolPlugin()?[this.getId()+"Data",this.getId()+"FinishedE2ETrace"]:[this.getId()+"ToggleDebug",this.getId()+"SetReboot",this.getId()+"Refresh",this.getId()+"StartE2ETrace",this.getId()+"ToggleStatistics"];if(this.runsAsToolPlugin()){this.e2eLogLevel="medium";this.e2eTraceStarted=false}}});n.prototype.onsapUiSupportTechInfoData=function(e){var o=this;var r=e.getParameter("data");r.modules.sort();this.e2eTraceStarted=r["e2e-trace"].isStarted;var a=["<div class='sapUiSupportToolbar'>","<button id='",o.getId(),"-Refresh' class='sapUiSupportRoundedButton'>Refresh</button>","<div><div class='sapUiSupportTechInfoCntnt'>","<table border='0' cellpadding='3' class='infoTable'>"];function s(e,t){var o=[];if(e){var r=/^(\d{4})(\d{2})(\d{2})-?(\d{2})(\d{2})$/.exec(e);if(r){e=r[1]+"-"+r[2]+"-"+r[3]+"T"+r[4]+":"+r[5]}o.push("built at "+p(e))}if(t){o.push("last change "+p(t))}return o.length===0?"":" ("+o.join(", ")+")"}var n="SAPUI5";var u="not available";try{var d=sap.ui.getVersionInfo();n=d.name;u="<a href='"+sap.ui.resource("","sap-ui-version.json")+"' target='_blank' class='sapUiSupportLink' title='Open Version Info'>"+p(d.version)+"</a>"+s(d.buildTimestamp,d.scmRevision)}catch(e){}c(a,true,true,n,function(e){e.push(u)});if(!/openui5/i.test(n)){c(a,true,true,"OpenUI5 Version",function(e){e.push(p(r.version)+s(r.build,r.change))})}c(a,true,true,"Loaded jQuery Version",function(e){return r.jquery});c(a,true,true,"User Agent",function(e){return r.useragent+(r.docmode?", Document Mode '"+r.docmode+"'":"")});c(a,true,true,"Debug Sources",function(e){e.push(r.debug?"ON":"OFF","<a href='#' id='",o.getId(),"-tggleDbgSrc' class='sapUiSupportLink'>Toggle</a>")});c(a,true,true,"Application",r.appurl);l(a,true,true,"Configuration (bootstrap)",r.bootconfig);l(a,true,true,"Configuration (computed)",r.config);if(!t(r.libraries)){l(a,true,true,"Libraries",r.libraries)}l(a,true,true,"Loaded Libraries",r.loadedLibraries);c(a,true,true,"Loaded Modules",function(e){jQuery.each(r.modules,function(t,o){if(o.indexOf("sap.ui.core.support")<0){e.push("<span>",p(o),"</span>");if(t<r.modules.length-1){e.push(", ")}}})});l(a,true,true,"URI Parameters",r.uriparams);c(a,true,true,"E2E Trace",function(e){e.push("<label class='sapUiSupportLabel'>Trace Level:</label>","<select id='",o.getId(),"-logLevelE2ETrace' class='sapUiSupportTxtFld sapUiSupportSelect'>","<option value='low'"+(o.e2eLogLevel==="low"?" selected":"")+">LOW</option>","<option value='medium'"+(o.e2eLogLevel==="medium"?" selected":"")+">MEDIUM</option>","<option value='high'"+(o.e2eLogLevel==="hight"?" selected":"")+">HIGH</option>","</select>");e.push("<button id='"+o.getId()+"-startE2ETrace' class='sapUiSupportRoundedButton "+(r["e2e-trace"].isStarted?" active":"")+"'>"+(r["e2e-trace"].isStarted?"Running...":"Start")+"</button>");e.push("<div class='sapUiSupportTechInfoXMLOutput'>");e.push("<label class='sapUiSupportLabel'>XML Output:</label>");e.push("<textarea id='"+o.getId()+"-outputE2ETrace'></textarea>");e.push("</div>")});a.push("</table></div>");this.$().html(a.join(""));this.$("tggleDbgSrc").on("click",function(e){e.preventDefault();i.getStub().sendEvent(o.getId()+"ToggleDebug",{})});this.$("Refresh").on("click",function(e){e.preventDefault();i.getStub().sendEvent(o.getId()+"Refresh",{})});this.$("outputE2ETrace").on("click",function(){this.focus();this.select()});this.$("startE2ETrace").on("click",function(){if(!o.e2eTraceStarted){o.e2eLogLevel=o.$("logLevelE2ETrace").val();o.$("startE2ETrace").addClass("active").text("Running...");o.$("outputE2ETrace").text("");i.getStub().sendEvent(o.getId()+"StartE2ETrace",{level:o.e2eLogLevel});o.e2eTraceStarted=true}});document.title="UI5 Diagnostics - "+r.title};n.prototype.onsapUiSupportTechInfoToggleDebug=function(e){jQuery.sap.debug(!jQuery.sap.debug());u(this)};n.prototype.onsapUiSupportTechInfoSetReboot=function(e){jQuery.sap.setReboot(e.getParameter("rebootUrl"))};n.prototype.onsapUiSupportTechInfoStartE2ETrace=function(t){var o=this,r=t.getParameter("level");sap.ui.require(["sap/ui/core/support/trace/E2eTraceLib"],function(e){e.start(r,function(e){i.getStub().sendEvent(o.getId()+"FinishedE2ETrace",{trace:e})})},function(t){e.error("Could not load module 'sap/ui/core/support/trace/E2eTraceLib':",t)})};n.prototype.onsapUiSupportTechInfoFinishedE2ETrace=function(e){this.$("startE2ETrace").removeClass("active").text("Start");this.$("outputE2ETrace").text(e.getParameter("trace"));this.e2eTraceStarted=false};n.prototype.onsapUiSupportTechInfoRefresh=function(e){u(this)};n.prototype.onsapUiSupportTechInfoToggleStatistics=function(e){jQuery.sap.statistics(!jQuery.sap.statistics());u(this)};n.prototype.init=function(e){r.prototype.init.apply(this,arguments);if(!this.runsAsToolPlugin()){u(this);return}this.$().html("No Information available")};function u(e){var t=a.getFrameworkInformation();var o={version:t.commonInformation.version,build:t.commonInformation.buildTime,change:t.commonInformation.lastChange,jquery:t.commonInformation.jquery,useragent:t.commonInformation.userAgent,docmode:t.commonInformation.documentMode,debug:t.commonInformation.debugMode,bootconfig:t.configurationBootstrap,config:t.configurationComputed,libraries:t.libraries,loadedLibraries:t.loadedLibraries,modules:t.loadedModules,uriparams:t.URLParameters,appurl:t.commonInformation.applicationHREF,title:t.commonInformation.documentTitle,statistics:t.commonInformation.statistics};var r=sap.ui.require("sap/ui/core/support/trace/E2eTraceLib");o["e2e-trace"]={isStarted:r?r.isStarted():false};i.getStub().sendEvent(e.getId()+"Data",{data:o})}function p(e){return e==null?"":s(String(e))}function c(e,t,o,r,i){e.push("<tr><td ",t?"align='right' ":"","valign='top'>","<label class='sapUiSupportLabel'>",p(r),"</label></td><td",o?" class='sapUiSupportTechInfoBorder'":"",">");var a=i;if(typeof i==="function"){a=i(e)}e.push(p(a));e.push("</td></tr>")}function l(e,t,r,i,a){c(e,t,r,i,function(e){e.push("<table border='0' cellspacing='0' cellpadding='3'>");jQuery.each(a,function(t,r){var i="";if(r){if(typeof r==="string"||typeof r==="string"||typeof r==="boolean"){i=r}else if(Array.isArray(r)||o(r)){i=JSON.stringify(r)}}c(e,false,false,t,""+i)});e.push("</table>")})}return n});