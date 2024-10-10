// Build the metadata panel
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
  // Log the data to the console
  console.log(data);
});
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    

    // Filter the metadata for the object with the desired sample number
    let dropdownMenu = d3.select("#selDataset");
    let dataset = dropdownMenu.property("value");
    let filteredMeta = metadata.filter(item => item.id === dataset);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    filteredMeta.forEach(function(data) {
      d3.select("#sample-metadata") // Replace with your actual selector
        .append("div") // or any other tag you want to append
        .text(data.key + ": " + data.value); // Adjust according to your data structure
  });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let dropdownMenu = d3.select("#selDataset");
    let dataset = dropdownMenu.property("value");
    let filteredData = samples.filter(item => item === dataset);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_id = filteredData.otu_ids;
    let otu_labels = filteredData.otu_labels;
    let sampleValues = filteredData.sample_values;

    let bubble_data = [{
      x : otu_id,
      y : sampleValues,
      text: otu_labels,
      mode: 'markers',
      markers: {
        size : sampleValues,
        color : otu_id
      }
    }];

    // Build a Bubble Chart
    var layout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {
          title: 'OTU ID'
      },
      yaxis: {
          title: 'Number of Bacteria'
      }
  };

    // Render the Bubble Chart
    Plotly.newPlot('bubbleChart', bubble_data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otu_id_strings = otu_id.toString();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sorted_samples = filteredData.sample_values.sort(function sortFunction(a, b){
      return b - a;
    });
    let sliced_samples = sorted_samples.slice(0, 10);
    sliced_samples.reverse();

    // Render the Bar Chart
    let trace = {
      x: sliced_samples,
      y: otu_id_strings.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      name: "Bacteria",
      type: "bar",
      orientation: "h"
    };
    
    // Data array
    let data1 = [trace];
    
    // Apply a title to the layout
    let layout1 = {
      title: "Top 10 Bacteria Cultures found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
    
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("plot", data1, layout1);
    
    
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(function(name) {
      dropdownMenu.append("option")
          .text(name.value) // Set the text for the option
          .attr("value", name.value); // Set the value for the option
  });

    // Get the first sample from the list
    let firstSample = data.names[1]

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  d3.selectAll("#selDataset").on("change", buildCharts);
  d3.selectAll("#selDataset").on("change", buildMetadata);

};
d3.selectAll("#selDataset").on("change", buildCharts);
d3.selectAll("#selDataset").on("change", buildMetadata);

// Initialize the dashboard
init();
