d3.json("/samples").then(data => {
  var selector = d3.select('#selDataset');

  var sampleNames = data['names'];

  sampleNames.forEach(sample =>{
    selector
      .append('option')
      .property('value', sample)
      .text(sample);
  });

  var firstSample = sampleNames[0];

  buildCharts(firstSample);
  buildMetadata(firstSample);
});


function buildCharts(sample) {
  d3.json('/samples').then(data => {
    var samples = data['samples'];
    var resultArray = samples['filter'](sampleObj => sampleObj['id'] == sample);
    var result = resultArray[0];
    
    var otu_ids = result['otu_ids'];
    var otu_labels = result['otu_labels'];
    var sample_values = result['sample_values'];


    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: 'OTU ID'}
    };

    var bubbleData = [
      {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }
  ];

  Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
  var barData = [
    {
      y: yticks,
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    }
  ];

  var barLayout = {
    title: 'Top 10 Bacteria Cultures Found',
    margin: { t: 30, l: 150},
    xaxis: {'title': 'Sample Values'},
    yaxis: {'title': 'OTU ID'}
};

Plotly.newPlot('bar', barData, barLayout);
});
}

function buildMetadata(sample) {
d3.json('/samples').then(data => {
  var metadata = data['metadata'];

  var resultArray = metadata.filter(sampleObj => sampleObj['id'] == sample);
  var result = resultArray[0];

  var PANEL = d3.select('#sample-metadata');

  PANEL.html('');

  Object.entries(result).forEach(([key, value]) => {
    PANEL.append('h6').text(`${key.toUpperCase()}: ${value}`);
  });

  wash_frequency = result.wfreq;
  buildGauge(wash_frequency);
});
}

function buildGauge(wash_frequency){
var data = [
  {
    type: "indicator",
    mode: "gauge+number",
    value: wash_frequency,
    title: { text: "Weekly Wash Frequency", font: { size: 24 } },
    gauge: {
      axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
      bar: { color: "darkblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 9], color: "lavender" },
      ],
    }
  }
];

var layout = {
  width: 500,
  height: 400,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  font: { size: 16}
};
var GAUGE = d3.select('#gauge').node();
Plotly.newPlot(GAUGE, data, layout);

}



function optionChanged(newSample){
buildCharts(newSample);
buildMetadata(newSample);
}