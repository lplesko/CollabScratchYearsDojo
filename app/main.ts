import esri = __esri;

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Legend = require("esri/widgets/Legend");
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");
import FeatureEffect = require("esri/views/layers/support/FeatureEffect");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import { Extent } from "esri/geometry";
import { SimpleFillSymbol } from "esri/symbols";
import { SimpleRenderer } from "esri/renderers";
import { updateGrid } from "./heatmapChart";

import Expand = require("esri/widgets/Expand");
import Search = require("esri/widgets/Search");
import { dummies, years } from "./constants";

( async () => {

  const layer = new FeatureLayer({
    portalItem: {
      id: "1a79991cdffd444880a2403dc500bc1c"
    },
    outFields: [ "*" ],
    popupTemplate: {
      title: "{ENGLISH_NA} | {YearString}",
      expressionInfos: [
        {
          name: "1in1000",
          title: "1in1000 Popup",
          expression: "Round((($feature.UniqueIndividuals_perc)*10),1)",
          fieldInfos: [
          //the following sets will ensure that the income and housing field names appear as their designated LABEL in pie chart
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
            fieldName: "Unknown_Housing",
            label: "Unknown Housing",
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
          },
          {
            fieldName: "Unknown_Income",
            label: "Unknown Income",
            format: {
              digitSeparator: true,
              places: 0
            }
          }
          ]
        }
      ],

      content:[
        {
          type: "text",
          text:
            "In this electoral riding, {expression/1in1000} out of 1000 people accessed a food bank this year."
        },
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "Pop2016",
              label: "Total Population (2016)",
              format: {
                digitSeparator: true,
                places: 0
              }
            },
            {
              fieldName: "Total_visits",
              label: "Total visits to a food bank",
              format: {
                  digitSeparator: true,
                  places: 0
              }
            },
            {
              fieldName: "UniqueIndividuals_cnt",
              label: "Total unique visits",
              format: {
                digitSeparator: true,
                places: 0
              }
            }
          ]
        },
        {
          type: "media", //MediaContentElement for chart
          mediaInfos: [
            {
              title: "<b>Housing</b>",
              type: "pie-chart",
              caption: "",
              value: {
                fields: ["Band_Owned", "Emergency_Shelter", "On_the_Street", "Rooming_House", "Own_Home", "Private_Rental", "Social_Housing", "Family_or_Friends", "Youth_Home_Shelter", "Unknown_Housing"],
                normalizeField: null
              }
            }
          ]
        },
        {
          type: "media",
          mediaInfos: [
            {
              title: "<b>Primary Source of Income</b>",
              type: "pie-chart",
              caption: "",
              value: {
                fields: ["Canada_Child_Benefit", "Disability_Benefits", "Employment", "Employment_Insurance", "No_Income", "Pension", "Provincial_Disability", "Social_Assistance", "Student_Loan", "Unknown_Income"],
                normalizeField: null
              }
            }
          ]
        }     
      ]
    }
  });

  const districtsLayer = new FeatureLayer({
    title: "districts",
    portalItem: {
      id: "1a79991cdffd444880a2403dc500bc1c"
    },
    popupTemplate: null,
    opacity: 0,
    renderer: new SimpleRenderer({
      symbol: new SimpleFillSymbol({
        color: [ 0,0,0,1 ],
        outline: null
      })
    })
  });

  const map = new EsriMap({
    basemap: "gray",
    layers: [ layer, districtsLayer ]
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [ -85, 50 ],
    zoom: 5,
    highlightOptions: {
      color: "#00AEC7",
      haloOpacity: 1,
      fillOpacity: 0
    }
  });
  
    const legend = new Legend({
      view: view,
      layerInfos: [
        {
          layer: layer,
          title: "Food Bank Usage"
        }
      ]
    });
  
  const search = new Search({
    view: view
  });
  
  await view.when();
  const chartExpand = new Expand({
    view,
    content: document.getElementById("chartDiv"),
    expandIconClass: "esri-icon-chart",
    group: "top-left"
  });
  view.ui.add(chartExpand, "top-left");
  view.ui.add("logoDiv", "bottom-left");
  view.ui.add(search, "top-right");
  view.ui.add(legend, "bottom-right");

  const layerView = await view.whenLayerView(layer) as esri.FeatureLayerView;
  const districtsLayerView = await view.whenLayerView(districtsLayer) as esri.FeatureLayerView;

  const layerStats = await queryLayerStatistics(layer);
  updateGrid(layerStats, layerView);

  function resetOnCollapse (expanded:boolean) {
    if (!expanded){
      resetVisuals();
    }
  }

  chartExpand.watch("expanded", resetOnCollapse);

  let highlight:any = null;
  view.on("drag", ["Control"], eventListener);
  view.on("click", ["Control"], eventListener);
  let previousId: number;
  async function eventListener (event:any) {
    event.stopPropagation();

    const hitResponse = await view.hitTest(event);
    const hitResults = hitResponse.results.filter( hit => hit.graphic.layer === districtsLayer );
    if(hitResults.length > 0){
      const graphic = hitResults[0].graphic;
      if(previousId !== graphic.attributes.FID){
        previousId = graphic.attributes.FID;
        if (highlight) {
          highlight.remove();
          highlight = null;
        }
        
        highlight = districtsLayerView.highlight([previousId]);
        const geometry = graphic && graphic.geometry;
        let queryOptions = {
          geometry,
          spatialRelationship: "intersects"
        };

        const filterOptions = new FeatureFilter(queryOptions);

        layerView.effect = new FeatureEffect({
          filter: filterOptions,
          excludedEffect: "grayscale(90%) opacity(15%)"
        });

        const stats = await queryTimeStatistics(layerView, queryOptions);
        updateGrid(stats);
      }
    }
  }

  interface QueryTimeStatsParams {
    geometry?: esri.Geometry,
    distance?: number,
    units?: string
  }

  async function queryTimeStatistics ( layerView: esri.FeatureLayerView, params: QueryTimeStatsParams): Promise<ChartData[]>{
    const { geometry, distance, units } = params;

    const query = layerView.layer.createQuery();

    query.outStatistics = [
      new StatisticDefinition({
        onStatisticField: "Total_visits",
        outStatisticFieldName: "value",
        statisticType: "sum"
      })
    ];
    query.groupByFieldsForStatistics = [ "YearString + '-' + Dummy" ];
    query.geometry = geometry;
    query.distance = distance;
    query.units = units;
    query.returnQueryGeometry = true;

    const queryResponse = await layerView.queryFeatures(query);

    const responseChartData = queryResponse.features.map( feature => {
      const timeSpan = feature.attributes["EXPR_1"].split("-");
      const year = timeSpan[0];
      const dummy = timeSpan[1];
      return {
        dummy,
        year, 
        value: feature.attributes.value
      };
    });
    return createDataObjects(responseChartData);
  }

  async function queryLayerStatistics(layer: esri.FeatureLayer): Promise<ChartData[]> {
    const query = layer.createQuery();
    query.outStatistics = [
      new StatisticDefinition({
        onStatisticField: "Total_visits",
        outStatisticFieldName: "value",
        statisticType: "sum"
      })
    ];
    query.groupByFieldsForStatistics = [ "YearString + '-' + Dummy" ];

    const queryResponse = await layer.queryFeatures(query);

    const responseChartData = queryResponse.features.map( feature => {
      const timeSpan = feature.attributes["EXPR_1"].split("-");
      const year = timeSpan[0];
      const dummy = timeSpan[1];
      return {
        dummy,
        year, 
        value: feature.attributes.value
      };
    });
    return createDataObjects(responseChartData);
  }

  function createDataObjects(data: StatisticsResponse[]): ChartData[] {
    let formattedChartData: ChartData[] = [];

    months.forEach( (year, s) => {
      years.forEach( (dummy, t) => {

        const matches = data.filter( datum => {
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

  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", resetVisuals);

  function resetVisuals () {
    layerView.filter = null;
    layerView.effect = null;
    if(highlight){
      highlight.remove();
      highlight = null;
    }
    
    updateGrid(layerStats, layerView, true);
  }

})();
