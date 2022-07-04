define("UsrRealty1Page", ["RightUtilities"], function(RightUtilities) {
	return {
		entitySchemaName: "UsrRealty",
		attributes: {
			"HasAccessToManager": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"value": false
			},
			"CommissionUSD": {
				"dataValueType": Terrasoft.DataValueType.FLOAT,
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"value": 0.00,
				dependencies: [
                    {
                        /* The [Commission] column value depends on the [Price, USD] and [Offer type] column values. */
                        columns: ["UsrPriceUSD", "UsrOfferType"],
                        /* The handler method that is called when the [Price, USD] or [Offer type] column value changes. */
                        methodName: "calculateCommission"
                    }
                ]
			},
			"UsrOfferType":{
				lookupListConfig: {
						columns: ["UsrCommissionCoeff"]
			    },
			},
			"UsrManager": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					filter: function() {
						const filter =  this.Terrasoft.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,
							"[SysAdminUnit:Contact:Id].Active", true);
						return filter;
					}
				}				
			},
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrRealtyFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrRealty"
				}
			},
			"UsrSchema56d61b25Detailffa64a5e": {
				"schemaName": "UsrRealtyVisitDetail",
				"entitySchemaName": "UsrRealtyVisit",
				"filter": {
					"detailColumn": "UsrParentRealty",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"UsrComment": {
				"651f802e-877e-44df-8633-d85eaa3b6b86": {
					"uId": "651f802e-877e-44df-8633-d85eaa3b6b86",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "UsrOfferType"
							}
						}
					]
				}
			},
			"UsrManager": {
				"6c5cf689-1a9d-4497-b427-cffee7515ac2": {
					"uId": "6c5cf689-1a9d-4497-b427-cffee7515ac2",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 1,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "HasAccessToManager"
							},
							"rightExpression": {
								"type": 0,
								"value": true,
								"dataValueType": 12
							}
						}
					]
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		/**publisher*/
		messages: {
			"MyMessageCode": {
        		mode: Terrasoft.MessageMode.PTP,
        		direction: Terrasoft.MessageDirectionType.PUBLISH
		    },
		},
		methods: {
			init: function() {
 				this.callParent(arguments);
				
				// Registering of messages, get result from onMyButtonClick
    			this.sandbox.registerMessages(this.messages);
			},
			//Validation
			setValidationConfig: function() {
                /* Call the initialization of the parent view model's validators. */
                this.callParent(arguments);
                /* Add the dueDateValidator() validator method for the [DueDate] column. */
                this.addColumnValidator("UsrPriceUSD", this.positiveValueValidator);
                this.addColumnValidator("UsrAreaSqM", this.positiveValueValidator);				
            },
			positiveValueValidator: function(value, column){
				/* The variable that stores the validation error message. */
                var msg = "";
                if (value < 0) {
                    msg = this.get("Resources.Strings.ValueMustBeGreaterThanZero");
                }
                /* The object whose property contains the validation error message. If the validation is successful, returns an empty string. */
                return {
                    /* The validation error message. */
                    invalidMessage: msg
                };
			},
			calculateCommission: function(){
				var price = this.get("UsrPriceUSD");
				if(!price){
					price = 0;
				}
				var offerTypeObject = this.get("UsrOfferType");
				var coeff = 0;
				if(offerTypeObject){
					coeff = offerTypeObject.UsrCommissionCoeff;
				}
				var result = price * coeff;
				this.set("CommissionUSD", result);
			},
			/**about Operation permissions_CanChangeRealtyManager**/
			onEntityInitialized: function(){
				this.callParent(arguments);/* Parent: BaseEntityPage*/
				this.getOperationAccessData();
				this.calculateCommission();
			},
			getOperationAccessData: function(){
				/*..\Terrasoft.WebApp\Terrasoft.Configuration\Autogenerated\Src\RightUtilities.NUI.js*/
				RightUtilities.checkCanExecuteOperation({
					operation: "CanChangeRealtyManager"
				}, this.onGetOperationResult, this);
			},
			onGetOperationResult:function(result){
				this.set("HasAccessToManager",result);
				this.console.log("HasAccessToManager = " + result);
			},
			/**about MyButton**/
			onMyButtonClick: function() {
				this.showInformationDialog("My button was pressed!");
				this.console.log("Yes, it's true. Our button was pressed.");
				
				/*Assigning lookup column value*/
				var obj = {
					value: "ad765104-83c4-49ff-84ee-10fb3fc634c3",
					displayValue: "3. Parking Lot"
				};
				this.set("UsrType", obj);
				
				/**sandbox publish result*/
				this.console.log("Message published.");
				var result = this.sandbox.publish("MyMessageCode", null, []);
				this.console.log("Subscriber responded: " + result);
			},
			getMyButtonEnabled: function() {
				var result = true;
				var name = this.get("UsrName");
				if(!name){
					return false;
				}
				return result;
			}
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrNamead06a005-f973-4bbb-8537-8d0522d4e6d4",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FLOAT8f021be8-c41c-49c5-aef4-f0338b72ba6c",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrPriceUSD",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "FLOAT6cc6a2e5-5a6f-433f-a523-271b390dd6c8",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrAreaSqM",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "CommissionControl",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "CommissionUSD",
					"enabled": false,
					"caption": {
						"bindTo": "Resources.Strings.CommissionCaption"
					},
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "MyButton",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"itemType": 5,
					"caption": {
						"bindTo": "Resources.Strings.MyButtonCaption"
					},
					"click": {
						"bindTo": "onMyButtonClick"
					},
					"enabled": {
						"bindTo": "getMyButtonEnabled"
					},
					"style": "red"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "LOOKUPb897f0b7-cdb7-4e05-a4c7-e7450476f944",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "LOOKUP24ca6731-7c0f-4b0e-b9ee-edc251f9e56d",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrOfferType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "STRINGc3fbfa62-5100-4370-a080-f72405adb37e",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 2,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrComment",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "LOOKUP71f582ae-1e76-4433-85f9-8522a381eac5",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "Header"
					},
					"bindTo": "UsrManager",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "Tab792ba6ccTabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab792ba6ccTabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrSchema56d61b25Detailffa64a5e",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "Tab792ba6ccTabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
