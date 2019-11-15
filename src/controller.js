var qlik = window.require('qlik');
import $ from 'jquery';
import picasso from 'picasso.js';
import picassoQ from 'picasso-plugin-q';
import chartdef from './chartdef';

export default ['$scope', '$element', function ($scope, $element) {
  picasso.use(picassoQ);

  const ds = [{
    type: 'q',
    key: 'qHyperCube',
    data: $scope.layout.qHyperCube
  }];

  var picassoSettings;

  //picks settings JSON for picasso --> picassoSettings
  function getSettings() {
    var chartType = $scope.layout.prop.minichart.type;
    var amountMes = $scope.layout.qHyperCube.qMeasureInfo.length;

    switch (chartType) {
      case 'bar':
        switch (amountMes) {
          case 1:
            picassoSettings = chartdef.bar1mes($scope.layout.prop);
            break;
          case 2:
            picassoSettings = chartdef.bar2mes($scope.layout.prop);
            break;
        }
        break;
      case 'line':
        switch (amountMes) {
          case 1:
            picassoSettings = chartdef.line1mes($scope.layout.prop);
            break;
          case 2:
            picassoSettings = chartdef.line2mes($scope.layout.prop);
            break;
        }
        break;
      case 'gauge':
        picassoSettings = chartdef.gauge1mes($scope.layout.prop);
        break;
    }
  }

  //function to create picasso chart
  function createChart() {
    //setTimeout(function () {

    getSettings();
    //console.log(picassoSettings);
    $scope.chart = picasso.chart({
      element: $element.find('.adv-kpi-chart')[0],
      data: ds,
      settings: picassoSettings,
      beforeRender() { qlik.resize(); }
    });

    // }, 3000);
  }

  //Scope for changes within hypercube measures
  $scope.$watch("layout.qHyperCube.qMeasureInfo", function () {
    if ($scope.layout.qHyperCube.qMeasureInfo[0] && $scope.layout.qHyperCube.qDimensionInfo[0]) {
      if ($scope.chart) {
        getSettings();
        $scope.chart.settings = picassoSettings;
        $scope.chart.update($scope.chart);
      } else {
        createChart();
      }
    } else {
      if ($scope.chart) {
        $scope.chart.destroy();
        $scope.chart = false;
      }
    }
  }, true);

  //Scope for changes within hypercube dimension
  $scope.$watch("layout.qHyperCube.qDimensionInfo", function () {
    if ($scope.layout.qHyperCube.qMeasureInfo[0] && $scope.layout.qHyperCube.qDimensionInfo[0]) {
      if ($scope.chart) {
        getSettings();
        $scope.chart.settings = picassoSettings;
        $scope.chart.update($scope.chart);
      } else {
        createChart();
      }
    } else {
      if ($scope.chart) {
        $scope.chart.destroy();
        $scope.chart = false;
      }
    }
  }, true);

  //Scope  for changes within minichart settings
  $scope.$watch("layout.prop", function () {
    if ($scope.chart) {
      getSettings();
      $scope.chart.settings = picassoSettings;
      //console.log(picassoSettings);
      $scope.chart.update($scope.chart);
      qlik.resize();
    }
  }, true);

  //Get initial Settings
  getSettings();

  //Scope CSS definition for background
  $scope.$watch('[layout.prop.background]', function () {
    try {
      if ($scope.layout.prop.background.cssswitch) {
        if($scope.layout.prop.background.css != '') {
          $scope.backgroundcss = JSON.parse($scope.layout.prop.background.css);
        }
        if ($scope.layout.prop.background.pictureswitch) {
          $scope.backgroundcss["background-image"] = 'url(' + $scope.layout.prop.background.picture + ')';
        }
      } else {
        $scope.backgroundcss = { "background-color": $scope.layout.prop.background.color.color };
      }
    } catch (err) {
      console.log(err);
    }
  }, true);

  //eventlistener for Sheet-navigation
  $element.find('.adv-kpi-1')[0].addEventListener("click", function () {
    if ($scope.layout.prop.measure1.jump.switch) {
      qlik.navigation.gotoSheet($scope.layout.prop.measure1.jump.sheet);
    }
  });

}];