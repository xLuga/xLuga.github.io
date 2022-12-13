/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/ui/core/Control","sap/ui/core/Core","sap/ui/core/delegate/ScrollEnablement","./WizardProgressNavigator","sap/ui/core/util/ResponsivePaddingsEnablement","sap/ui/Device","./WizardRenderer","sap/ui/core/CustomData","sap/ui/dom/containsOrEquals","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/Focusable"],function(t,e,r,i,n,s,o,a,p,u,h,g){"use strict";var l=t.PageBackgroundDesign;var c=t.WizardRenderMode;var d=e.extend("sap.m.Wizard",{metadata:{library:"sap.m",designtime:"sap/m/designtime/Wizard.designtime",interfaces:["sap.f.IDynamicPageStickyContent"],properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"auto"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},showNextButton:{type:"boolean",group:"Behavior",defaultValue:true},finishButtonText:{type:"string",group:"Appearance",defaultValue:"Review"},enableBranching:{type:"boolean",group:"Behavior",defaultValue:false},backgroundDesign:{type:"sap.m.PageBackgroundDesign",group:"Appearance",defaultValue:l.Standard},renderMode:{type:"sap.m.WizardRenderMode",group:"Appearance",defaultValue:c.Scroll}},defaultAggregation:"steps",aggregations:{steps:{type:"sap.m.WizardStep",multiple:true,singularName:"step"},_progressNavigator:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_nextButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{
/**
					 * This association controls the current activated step of the wizard (meaning the last step)
					 * For example if we have A->B->C->D steps, we are on step A and we setCurrentStep(C) A,B and C are going to be activated. D will still remain unvisited.
					 * The parameter needs to be a Wizard step that is part of the current Wizard
					 * @since 1.50
					 */
currentStep:{type:"sap.m.WizardStep",multiple:false}},events:{stepActivate:{parameters:{index:{type:"int"}}},complete:{parameters:{}}},dnd:{draggable:false,droppable:true}}});d.CONSTANTS={MINIMUM_STEPS:3,MAXIMUM_STEPS:8,ANIMATION_TIME:300,SCROLL_OFFSET:16};s.call(d.prototype,{header:{suffix:"progressNavigator"},content:{suffix:"step-container"}});d.prototype.init=function(){this._iStepCount=0;this._aStepPath=[];this._bScrollLocked=false;this._oScroller=this._initScrollEnablement();this._oResourceBundle=r.getLibraryResourceBundle("sap.m");this._initProgressNavigator();this._initResponsivePaddingsEnablement()};d.prototype.onBeforeRendering=function(){var t=this._getStartingStep();if(!this._isMinStepCountReached()||this._isMaxStepCountExceeded()){h.error("The Wizard is supposed to handle from 3 to 8 steps.")}this._saveInitialValidatedState();if(t&&this._aStepPath.indexOf(t)<0){this._activateStep(t);t._setNumberInvisibleText(1)}};d.prototype.onAfterRendering=function(){if(!this.getCurrentStep()){this.setAssociation("currentStep",this._getStartingStep(),true)}var t=this._getCurrentStepInstance();if(t){this._activateAllPreceedingSteps(t)}this._attachScrollHandler();this._renderPageMode()};d.prototype._renderPageMode=function(t){var e,i,n;if(this.getRenderMode()!==c.Page){return}if(t){e=this._aStepPath.indexOf(t)+1;i=t}else{e=this._getProgressNavigator().getCurrentStep();i=this._aStepPath[e-1]}n=r.createRenderManager();n.renderControl(this._updateStepTitleNumber(i,e));n.flush(this.getDomRef("step-container"));n.destroy()};d.prototype._updateStepTitleNumber=function(t,e){var r=t.getCustomData().filter(function(t){return t.getKey()==="stepIndex"})[0];if(r){r.setValue(e)}else{t.addCustomData(new p({key:"stepIndex",value:e}))}return t};d.prototype.exit=function(){var t=this.getDomRef("step-container");if(t){t.onscroll=null}this._oScroller.destroy();this._oScroller=null;this._aStepPath=null;this._iStepCount=null;this._bScrollLocked=null;this._oResourceBundle=null;this._bNextButtonPressed=null};d.prototype.validateStep=function(t){if(!this._containsStep(t)){h.error("The wizard does not contain this step");return this}t.setValidated(true);return this};d.prototype.invalidateStep=function(t){if(!this._containsStep(t)){h.error("The wizard does not contain this step");return this}t.setValidated(false);return this};d.prototype.nextStep=function(){var t=this._getProgressNavigator().getProgress()-1;var e=this._aStepPath[t];this.validateStep(e);e._complete();return this};d.prototype.previousStep=function(){var t=this._getProgressNavigator().getProgress()-2;if(t>=0){this.discardProgress(this._aStepPath[t])}return this};d.prototype.getProgress=function(){return this._getProgressNavigator().getProgress()};d.prototype.getProgressStep=function(){return this._aStepPath[this.getProgress()-1]};d.prototype.goToStep=function(t,e){var r=function(){var e=this._getProgressNavigator();e&&e._updateCurrentStep(this._aStepPath.indexOf(t)+1)};if(!this.getVisible()||this._aStepPath.indexOf(t)<0){return this}else if(this.getRenderMode()===c.Page){r.call(this);this._renderPageMode(t);return this}t._setNumberInvisibleText(this.getProgress());var i=this,n={scrollTop:this._getStepScrollOffset(t)},s={queue:false,duration:d.CONSTANTS.ANIMATION_TIME,start:function(){i._bScrollLocked=true},complete:function(){i._bScrollLocked=false;r.call(i);if(e||e===undefined){i._focusFirstStepElement(t)}}};g(this.getDomRef("step-container")).animate(n,s);return this};d.prototype.discardProgress=function(t,e){var r=this.getProgress(),i=this._aStepPath,n=this._aStepPath.indexOf(t),s=this._aStepPath[n],o=n+1;if(o>r||o<=0){h.warning("The given step is either not yet reached, or is not present in the wizard control.");return this}this._getProgressNavigator().discardProgress(o,true);this._updateProgressNavigator();this._restoreInitialValidatedState(o);for(var a=o;a<i.length;a++){i[a]._deactivate();if(i[a].getSubsequentSteps().length>1){i[a].setNextStep(null)}}this.setAssociation("currentStep",t);s.setWizardContext({sButtonText:this._getNextButtonText(),bLast:true});if(t.getSubsequentSteps().length>1&&!e){t.setNextStep(null)}i.splice(o);return this};d.prototype.setCurrentStep=function(t){var e=typeof t==="string"?r.byId(t):t;if(!this.getEnableBranching()){this.setAssociation("currentStep",t,true)}if(e&&this._isStepReachable(e)){this._activateAllPreceedingSteps(e)}else{h.error("The given step could not be set as current step.")}return this};d.prototype.setShowNextButton=function(t){this.setProperty("showNextButton",t,true);this.getSteps().forEach(function(e){e.setWizardContext({bParentAllowsButtonShow:t})});return this};d.prototype.getFinishButtonText=function(){if(this.getProperty("finishButtonText")==="Review"){return this._oResourceBundle.getText("WIZARD_FINISH")}else{return this.getProperty("finishButtonText")}};d.prototype.addStep=function(t){if(this._isMaxStepCountExceeded()){h.error("The Wizard is supposed to handle up to 8 steps.");return this}t.setWizardContext({bParentAllowsButtonShow:this.getShowNextButton()});this._incrementStepCount();return this.addAggregation("steps",t)};d.prototype.setBackgroundDesign=function(t){var e=this.getBackgroundDesign();this.setProperty("backgroundDesign",t,true);this.$().removeClass("sapMWizardBg"+e).addClass("sapMWizardBg"+this.getBackgroundDesign());return this};d.prototype.insertStep=function(t,e){throw new Error("Dynamic step insertion is not yet supported.")};d.prototype.removeStep=function(t){throw new Error("Dynamic step removal is not yet supported.")};d.prototype.removeAllSteps=function(){this._resetStepCount();return this.removeAllAggregation("steps").map(function(t){return t},this)};d.prototype.destroySteps=function(){this._resetStepCount();return this.destroyAggregation("steps")};d.prototype._getStickyContent=function(){return this._getProgressNavigator()};d.prototype._returnStickyContent=function(){if(this.bIsDestroyed){return}this._getStickyContent().$().prependTo(this.$())};d.prototype._setStickySubheaderSticked=function(t){this._bStickyContentSticked=t};d.prototype._getStickySubheaderSticked=function(){return this._bStickyContentSticked};d.prototype._activateAllPreceedingSteps=function(t){if(this._aStepPath.indexOf(t)>=0){this.discardProgress(t,true);return}while(this.getProgressStep()!==t){this.nextStep()}};d.prototype._isNextStepDetermined=function(t,e){if(!this.getEnableBranching()){return true}t=t||this._getCurrentStepInstance();return this._getNextStep(t,e)!==null};d.prototype._isStepReachable=function(t){if(this.getEnableBranching()){var e=this._getStartingStep();while(e!==t){e=e._getNextStepReference();if(e==null){return false}}this.setAssociation("currentStep",t);return true}else{return this.getSteps().indexOf(t)>=0}};d.prototype._initScrollEnablement=function(){return new i(this,null,{scrollContainerId:this.getId()+"-step-container",horizontal:false,vertical:true})};d.prototype._initProgressNavigator=function(){var t=this,e=new n(this.getId()+"-progressNavigator",{stepChanged:this._handleStepChanged.bind(this)});e._setOnEnter(function(e,r){var i=t._aStepPath[r];setTimeout(function(){this._focusFirstStepElement(i)}.bind(t),d.CONSTANTS.ANIMATION_TIME)});this.setAggregation("_progressNavigator",e)};d.prototype._handleNextButtonPress=function(){var t=this._getProgressNavigator(),e=t.getProgress(),r=this.isStepFinal();if(r){this.fireComplete()}else{var i=this.getProgressStep();if(!this._isNextStepDetermined(i,e)){throw new Error("The wizard is in branching mode, and the nextStep association is not set.")}this._bNextButtonPressed=true;t.incrementProgress();this._handleStepActivated(t.getProgress());this._handleStepChanged(t.getProgress())}};d.prototype._getStepScrollOffset=function(t){var e=this.getDomRef("step-container"),r=e?e.scrollTop:0,i=this._getNextButton(),n=this._getCurrentStepInstance(),s=0,a=0,p=t.getDomRef()?t.getDomRef().scrollHeight:0,h=e?e.clientHeight:0,g=!!i&&u(n.getDomRef(),i.getDomRef());if(t&&t.$()&&t.$().position()){s=t.$().position().top||0}if(!o.system.phone&&n&&!g||p>h&&this._bNextButtonPressed){a=i.$().outerHeight()}this._bNextButtonPressed=false;return r+s-(d.CONSTANTS.SCROLL_OFFSET+a)};d.prototype._focusFirstStepElement=function(t){var e=t.$();if(e&&e.firstFocusableDomRef()){e.firstFocusableDomRef().focus()}};d.prototype._handleStepChanged=function(t){var e=(typeof t==="number"?t:t.getParameter("current"))-2,r=this._aStepPath[e],i=this._getNextStep(r,e),n=o.system.desktop?true:false;this.goToStep(i,n)};d.prototype._handleStepActivated=function(t){var e=t-2,r=this._aStepPath[e],i=this._getNextStep(r,e);this._activateStep(i);this._updateProgressNavigator();this.fireStepActivate({index:t});this.setAssociation("currentStep",this.getProgressStep(),true);this.getProgressStep().setWizardContext({bLast:true,bReviewStep:this.isStepFinal(),sButtonText:this._getNextButtonText()})};d.prototype._isMaxStepCountExceeded=function(){var t=this._getStepCount();if(this.getEnableBranching()){return false}return t>=d.CONSTANTS.MAXIMUM_STEPS};d.prototype._isMinStepCountReached=function(){var t=this._getStepCount();return t>=d.CONSTANTS.MINIMUM_STEPS};d.prototype._getStepCount=function(){return this._iStepCount};d.prototype._incrementStepCount=function(){this._iStepCount+=1;this._getProgressNavigator().setStepCount(this._getStepCount())};d.prototype._decrementStepCount=function(){this._iStepCount-=1;this._getProgressNavigator().setStepCount(this._getStepCount())};d.prototype._resetStepCount=function(){this._iStepCount=0;this._getProgressNavigator().setStepCount(this._getStepCount())};d.prototype._getProgressNavigator=function(){return this.getAggregation("_progressNavigator")};d.prototype._saveInitialValidatedState=function(){if(this._aInitialValidatedState){return}this._aInitialValidatedState=this.getSteps().map(function(t){return t.getValidated()})};d.prototype._restoreInitialValidatedState=function(t){var e=this._aStepPath,r=this.getSteps();for(var i=t;i<e.length;i++){var n=e[i],s=r.indexOf(n),o=this._aInitialValidatedState[s];n.setValidated(o)}};d.prototype._getNextStep=function(t,e){if(!this.getEnableBranching()){return this.getSteps()[e+1]}if(e<0){return this._getStartingStep()}var r=t._getNextStepReference();if(r===null){throw new Error("The wizard is in branching mode, and no next step is defined for "+"the current step, please set one.")}if(!this._containsStep(r)){throw new Error("The next step that you have defined is not part of the wizard steps aggregation."+"Please add it to the wizard control.")}var i=t.getSubsequentSteps();if(i.length>0&&!t._containsSubsequentStep(r.getId())){throw new Error("The next step that you have defined is not contained inside the subsequentSteps"+" association of the current step.")}return r};d.prototype.isStepFinal=function(){var t,e=this._getStepCount(),r=this.getProgress();if(this.getEnableBranching()){t=this._aStepPath[this._aStepPath.length-1]._isLeaf()}else{t=r===e}return t};d.prototype._getNextButtonText=function(){if(this.isStepFinal()){return this.getFinishButtonText()}else{return this._oResourceBundle.getText("WIZARD_STEP")+" "+(this.getProgress()+1)}};d.prototype._getNextButton=function(){var t=this._getCurrentStepInstance();if(t){return t.getAggregation("_nextButton")}else{return null}};d.prototype._updateProgressNavigator=function(){var t=this._getProgressNavigator(),e=this._getStartingStep(),r=this.getSteps(),i=[e.getTitle()],n=[e.getIcon()],s=[e.getOptional()],o=1;if(this.getEnableBranching()){while(!e._isLeaf()&&e._getNextStepReference()!==null){o++;e=e._getNextStepReference();i.push(e.getTitle());s.push(e.getOptional());n.push(e.getIcon())}t.setVaryingStepCount(e._isBranched());t.setStepCount(o)}else{i=r.map(function(t){return t.getTitle()});s=r.map(function(t){return t.getOptional()});n=r.map(function(t){return t.getIcon()})}t.setStepTitles(i);t._aStepOptionalIndication=s;t.setStepIcons(n)};d.prototype._getStartingStep=function(){return this.getSteps()[0]};d.prototype._attachScrollHandler=function(){var t=this.getDomRef("step-container");t.onscroll=this._scrollHandler.bind(this)};d.prototype._scrollHandler=function(t){if(this._bScrollLocked){return}var e=t.target.scrollTop,r=this._getProgressNavigator(),i=this._aStepPath[r.getCurrentStep()-1],n=i&&i.getDomRef();if(!n){return}var s=n.clientHeight,o=n.offsetTop,a=100;if(e+a>=o+s&&r._isActiveStep(r._iCurrentStep+1)){r.nextStep()}var p=this.getSteps();for(var u=0;u<p.length;u++){if(e+a<=o){r.previousStep();i=this._aStepPath[r.getCurrentStep()-1];n=i&&i.getDomRef();if(!n){break}o=n.offsetTop}}};d.prototype._getCurrentStepInstance=function(){return r.byId(this.getCurrentStep())};d.prototype._containsStep=function(t){return this.getSteps().some(function(e){return e===t})};d.prototype._checkCircularReference=function(t){if(this._aStepPath.indexOf(t)>=0){throw new Error("The step that you are trying to activate has already been visited. You are creating "+"a loop inside the wizard.")}};d.prototype._activateStep=function(t){this._checkCircularReference(t);this._aStepPath.push(t);t._activate()};return d});