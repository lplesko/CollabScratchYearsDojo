var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend", "esri/views/layers/support/FeatureFilter", "esri/views/layers/support/FeatureEffect", "esri/tasks/support/StatisticDefinition", "esri/symbols", "esri/renderers", "./heatmapChart", "esri/widgets/Expand", "esri/widgets/Search", "./constants"], function (require, exports, EsriMap, MapView, FeatureLayer, Legend, FeatureFilter, FeatureEffect, StatisticDefinition, symbols_1, renderers_1, heatmapChart_1, Expand, Search, constants_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(_this, void 0, void 0, function () {
        function resetOnCollapse(expanded) {
            if (!expanded) {
                resetVisuals();
            }
        }
 
        function queryTimeStatistics(layerView, params) {
            return __awaiter(this, void 0, void 0, function () {
                var geometry, distance, units, query, queryResponse, responseChartData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            geometry = params.geometry, distance = params.distance, units = params.units;
                            query = layerView.layer.createQuery();
                            query.outStatistics = [
                                new StatisticDefinition({
                                    onStatisticField: "UniqueIndividuals_cnt",
                                    outStatisticFieldName: "value",
                                    statisticType: "sum"
                                })
                            ];
                            query.groupByFieldsForStatistics = ["YearString + '-' + Dummy"];
                            query.geometry = geometry;
                            query.distance = distance;
                            query.units = units;
                            query.returnQueryGeometry = true;
                            return [4 /*yield*/, layerView.queryFeatures(query)];
                        case 1:
                            queryResponse = _a.sent();
                            responseChartData = queryResponse.features.map(function (feature) {
                                var timeSpan = feature.attributes["EXPR_1"].split("-");
                                var year = timeSpan[0];
                                var dummy = timeSpan[1];
                                return {
                                    year: year,
                                    dummy: dummy,
                                    value: feature.attributes.value
                                };
                            });
                            return [2 /*return*/, createDataObjects(responseChartData)];
                    }
                });
            });
        }
        function queryLayerStatistics(layer) {
            return __awaiter(this, void 0, void 0, function () {
                var query, queryResponse, responseChartData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            query = layer.createQuery();
                            query.outStatistics = [
                                new StatisticDefinition({
                                    onStatisticField: "UniqueIndividuals_cnt",
                                    outStatisticFieldName: "value",
                                    statisticType: "sum"
                                })
                            ];
                            query.groupByFieldsForStatistics = ["YearString + '-' + Dummy"];
                            return [4 /*yield*/, layer.queryFeatures(query)];
                        case 1:
                            queryResponse = _a.sent();
                            responseChartData = queryResponse.features.map(function (feature) {
                                var timeSpan = feature.attributes["EXPR_1"].split("-");
                                var year = timeSpan[0];
                                var dummy = timeSpan[1];
                                return {
                                    year: year,
                                    dummy: dummy,
                                    value: feature.attributes.value
                                };
                            });
                            return [2 /*return*/, createDataObjects(responseChartData)];
                    }
                });
            });
        }
        function createDataObjects(data) {
            var formattedChartData = [];
            constants_1.years.forEach(function (year, s) {
                constants_1.dummies.forEach(function (dummy, t) {
                    var matches = data.filter(function (datum) {
                        return datum.year === year && datum.dummy === dummy;
                    });
                    formattedChartData.push({
                        col: t,
                        row: s,
                        value: matches.length > 0 ? matches[0].value : 0
                    });
                });
            });
            return formattedChartData;
        }
        function resetVisuals() {
            layerView.filter = null;
            layerView.effect = null;
            if (highlight) {
                highlight.remove();
                highlight = null;
            }
            heatmapChart_1.updateGrid(layerStats, layerView, true);
        }
        var layer, districtsLayer, northernLayer, map, mapList, view, legend, search, chartExpand, layerView, districtsLayerView, northernLayerView, layerStats, highlight, previousId, resetBtn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    layer = new FeatureLayer({
                        portalItem: {
                            id: "1a79991cdffd444880a2403dc500bc1c"
                        },
                        outFields: ["*"],
                        popupTemplate: {
                            title: "{ENGLISH_NA} | {YearString}",
                            expressionInfos: [
                              {
                                name: "1in1000",
                                title: "1in1000 Popup",
                                expression: "Round((($feature.UniqueIndividuals_perc)*10),1)"
                              }
                            ],
                            fieldInfos: [
                              //the following sets will ensure that the income and housing field names appear as their designated LABEL in pie chart
                              //the first in the list is for the newly generated statistic for the value that goes in the grid  
                                {
                                  fieldName: "value",
                                  label: "value",
                                  format: {
                                    digitSeparator: true,
                                    places: 0
                                  }
                                },
                                {
                                fieldName: "Band_Owned",
                                label: "Band Owned",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Emergency_Shelter",
                                label: "Emergency Shelter",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "On_the_Street",
                                label: "On the Street",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Rooming_House",
                                label: "Rooming House",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Own_Home",
                                label: "Own Home",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Private_Rental",
                                label: "Private Rental",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Social_Housing",
                                label: "Social Housing",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Family_or_Friends",
                                label: "Family or Friends",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Youth_Home_Shelter",
                                label: "Youth Home Shelter",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Canada_Child_Benefit",
                                label: "Canada Child Benefit",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Disability_Benefits",
                                label: "Disability Benefits",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Employment",
                                label: "Employment",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Employment_Insurance",
                                label: "Employment Insurance",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "No_Income",
                                label: "No Income",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Pension",
                                label: "Pension",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Provincial_Disability",
                                label: "Provincial Disability",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Social_Assistance",
                                label: "Social Assistance",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              },
                              {
                                fieldName: "Student_Loan",
                                label: "Student Loan",
                                format: {
                                  digitSeparator: true,
                                  places: 0
                                }
                              }
                            ],
                            content:[
                              {
                                type: "text",
                                text:
                                  "In this electoral riding, {expression/1in1000} out of 1000 people accessed a food bank at least once this year."
                              },
                              {
                                type: "fields",
                                fieldInfos: [
                                  {
                                    fieldName: "Pop2016",
                                    label: "Population of Riding (2016)",
                                    format: {
                                      digitSeparator: true,
                                      places: 0
                                    }
                                  },
                                  {
                                    fieldName: "UniqueIndividuals_cnt",
                                    label: "Total Unique Individuals",
                                    format: {
                                      digitSeparator: true,
                                      places: 0
                                    }
                                  },
                                  {	
                                    fieldName: "Adults",	
                                    label: "Visits by Adults",	
                                    format: {	
                                      digitSeparator: true,	
                                      places: 0	
                                    }	
                                  },	
                                  {	
                                    fieldName: "Children",	
                                    label: "Visits by Children",	
                                    format: {	
                                      digitSeparator: true, 	
                                      places: 0	
                                    }	
                                  },  
                                  {
                                    fieldName: "Total_visits",
                                    label: "Total Visits (Adults + Children)",
                                    format: {
                                        digitSeparator: true,
                                        places: 0
                                    }
                                  }  
                                ]
                              },
                              {
                                type: "text",
                                text:
                                  "<b>Primary Housing Type:<b>"
                              },
                              {
                                type: "media", //MediaContentElement for chart
                                mediaInfos: [
                                  {
                                    title: null,
                                    type: "column-chart",
                                    caption: "",
                                    value: {
                                      fields: ["Band_Owned", "Emergency_Shelter", "On_the_Street", "Rooming_House", "Own_Home", "Private_Rental", "Social_Housing", "Family_or_Friends", "Youth_Home_Shelter"],
                                      normalizeField: null
                                    }
                                  }
                                ]
                              },
                              {
                                type: "text",
                                text:
                                  "<b>Primary Source of Income:<b>"
                              },  
                              {
                                type: "media",
                                mediaInfos: [
                                  {
                                    title: null,
                                    type: "column-chart",
                                    caption: "Hover over a bar to learn more about who is visiting food banks in this riding.",
                                    value: {
                                      fields: ["Canada_Child_Benefit", "Disability_Benefits", "Employment", "Employment_Insurance", "No_Income", "Pension", "Provincial_Disability", "Social_Assistance", "Student_Loan"],
                                      normalizeField: null
                                    }
                                  }
                                ]
                              }     
                            ]                            

                          }
                    });
                    districtsLayer = new FeatureLayer({	
                        title: "districts",	
                        portalItem: {	
                            id: "1a79991cdffd444880a2403dc500bc1c"	
                        },	
                        popupTemplate: null,	
                        opacity: 0,	
                        renderer: new renderers_1.SimpleRenderer({	
                            symbol: new symbols_1.SimpleFillSymbol({	
                                color: [0, 0, 0, 1],	
                                outline: null	
                            })	
                        })	
                    });
                    northernLayer = new FeatureLayer({
                        portalItem: {
                            id: "0be94b8c12f646ba840a3b4bb5b20b2e"
                        },
                        outFields: ["*"],
                        popupTemplate: {
                            title: "{ENGLISH_NA}",
                            content:[
                              {
                                type: "text",
                                text:
                                  "<b>The North:<b>"
                              },
                              {
                                type: "text",
                                text:
                                  "Due to insufficient data, food bank use in the ridings of Kiiwetinoong, Mushkegowuk-James Bay, and Kenora-Rainy River, were not accurately reflected on this map. Northern food insecurity is both complex and a crisis in Ontario and across Canada. Northern food banks do provide service to these remote areas; however, the numbers reported are significantly lower than the number of people served or requiring support."
                              }]
                          }
                    }); 
                    
                    map = new EsriMap({
                        basemap: "gray",
                        layers: [layer, districtsLayer, northernLayer]
                    });

                    view = new MapView({
                        map: map,
                        container: "viewDiv",
                        center: [-87, 50],
                        zoom: 5,
                        highlightOptions: {
                            color: "#00AEC7",
                            haloOpacity: 1,
                            fillOpacity: 0
                        }
                    });
                    
                        legend = new Expand({
                            content: new Legend({
                                view: view,
                                layerInfos: [
                                    {
                                        layer: layer,
                                        title: "Food Bank Use by Electoral Riding"
                                    }
                                ]
                            }),
                            view: view,
                            expanded: true
                        });
                    search = new Search({
                        view: view,
                        locationEnabled: false
                    });
                    return [4 /*yield*/, view.when()];
                case 1:
                    _a.sent();
                    chartExpand = new Expand({
                        view: view,
                        content: document.getElementById("chartDiv"),
                        expandIconClass: "esri-icon-chart",
                        group: "top-left",
                        expanded: true
                    });
                    view.ui.add(chartExpand, "top-left");
                    view.ui.add(search, "top-right");
                    view.ui.add(legend, "bottom-right");
                    return [4 /*yield*/, view.whenLayerView(layer)];
                case 2:
                layerView = _a.sent();	
                    return[4 /*yield*/, view.whenLayerView(districtsLayer)];	
                case 3:	
                    districtsLayerView = _a.sent();	
                    return [4 /*yield*/, queryLayerStatistics(layer)];	
                case 4:
                    layerStats = _a.sent();
                    heatmapChart_1.updateGrid(layerStats, layerView);
                    chartExpand.watch("expanded", resetOnCollapse);
                    highlight = null;
                    resetBtn = document.getElementById("resetBtn");
                    resetBtn.addEventListener("click", resetVisuals);
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map
