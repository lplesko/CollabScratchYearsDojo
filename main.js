require([
  "esri/views/MapView",
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/widgets/Expand"
], function(MapView, Map, FeatureLayer, Expand) {
  let annualLayerView;

  // annual usage layer
  const annualLayer = new FeatureLayer({
    portalItem: {
      id: "c1c22edd96a4477ba505e222e176ba80"
    },
    outFields: ["YearString"]
  });

  // monthly usage layer


  const map = new Map({
    basemap: "gray-vector",
    layers: [annualLayer]
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-87, 50],
    zoom: 5
  });

  const yearNodes = document.querySelectorAll(`.year-item`);
  const yearsElement = document.getElementById("year-filter");

  // click event handler for seasons choices
  yearsElement.addEventListener("click", filterByYear);

  // User clicked on 2016, 2017, 2018, or 2019
  // set an attribute filter on annual layer view
  // to display the usage in that year
  function filterByYear(event) {
    const selectedYear = event.target.getAttribute("data-year");
    annualLayerView.filter = {
      where: "YearString = '" + selectedYear + "'"
    };
  }

  view.whenLayerView(annualLayer).then(function(layerView) {
    // annual layer loaded
    // get a reference to the annual layerview
    annualLayerView = layerView;

    // set up UI items
    yearsElement.style.visibility = "visible";
    const yearsExpand = new Expand({
      view: view,
      content: yearsElement,
      expandIconClass: "esri-icon-filter",
      group: "top-left"
    });
    //clear the filters when user closes the expand widget
    yearsExpand.watch("expanded", function() {
      if (!yearsExpand.expanded) {
        annualLayerView.filter = null;
      }
    });
    view.ui.add(yearsExpand, "top-left");
    view.ui.add("titleDiv", "top-right");
  });
});
