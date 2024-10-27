// Build the metadata panel
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
  // Log the data to the console
  console.log(data);
});
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    
    console.log("metadata");
    console.log(metadata);
    // Filter the metadata for the object with the desired sample number
    let dropdownMenu = d3.select("#selDataset");
    let dataset = dropdownMenu.property("value");
    console.log(dataset);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (i = 0; i < metadata.length; i++){
      if (metadata[i]['id'] == dataset){
        d3.select("#sample-metadata") // Replace with your actual selector
          .append("div") // or any other tag you want to append
          .text("ID: " + metadata[i]['id']) // Adjust according to your data structure
          .append("div")
          .text("ETHNICITY: " + metadata[i]['ethnicity'])
          .append("div")
          .text("GENDER: " + metadata[i]['gender'])
          .append("div")
          .text("AGE: " + metadata[i]['age'])
          .append("div")
          .text("LOCATION: " + metadata[i]['location'])
          .append("div")
          .text("BBTYPE: " + metadata[i]['bbtype'])
          .append("div")
          .text("WFREQ: " + metadata[i]['wfreq']);
}};
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {

    // Get the samples field
    let sampleData = data.samples
    console.log(sampleData)
    // Filter the samples for the object with the desired sample number
    let dropdownMenu = d3.select("#selDataset");
    let dataset = dropdownMenu.property("value");
    console.log(dataset)

    for (i = 0; i < sampleData.length; i++){
      if (sampleData[i]['id'] === dataset){
        console.log('filtered data');
        console.log(sampleData[i]);
    // Get the otu_ids, otu_labels, and sample_values
        let otu_id = sampleData[i]['otu_ids'];
        let otu_labels = sampleData[i]['otu_labels'];
        let sampleValues = sampleData[i]['sample_values'];
        console.log("otu_id");
        console.log(otu_id);
        let bubble_data = {
          x : otu_id,
          y : sampleValues,
          text: otu_labels,
          mode: 'markers',
          marker: {
            size : sampleValues,
            color : otu_id
          }
        };

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
        Plotly.newPlot('bubbleChart', [bubble_data], layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
        let otu_id_string = []
        for (i = 0; i < otu_id.length; i++){
          otu_id_string.push("OTU " + otu_id[i].toString());
        };
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
        let sorted_samples = sampleValues.sort(function sortFunction(a, b){
          return b - a;
        });
        let sliced_samples = sorted_samples.slice(0, 10);

        sliced_samples.reverse();
        console.log("slice samples and strings");
        console.log(otu_id)
        console.log(sliced_samples);
        console.log(otu_id_string);
    // Render the Bar Chart
        let trace = {
          x: sliced_samples,
          y: otu_id_string.slice(0,10),
          text: otu_labels.slice(0, 10),
          name: "Bacteria",
          type: "bar",
          orientation: "h"
    };
    
    // Data array
        let data1 = [trace];
    
    // Apply a title to the layout
        let layout1 = {
          title: "Top 10 Bacteria Cultures found",
          xaxis: {
            title: "Number of Bacteria",
          },
          yaxis: {
            tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            ticktext: otu_id_string.slice(0,10).reverse()
          },
          margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
      }
    };
    
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("plot", data1, layout1);
  }
      }
    });
};

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
          .text(name) // Set the text for the option
          .property("value", name); // Set the value for the option
  });

    // Get the first sample from the list
    let firstSample = names[0]
    console.log(firstSample)
    // Build charts and metadata panel with the first sample
    optionChanged(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
    
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

};
d3.selectAll("#selDataset").on("change", buildCharts);
d3.selectAll("#selDataset").on("change", buildMetadata);

// Initialize the dashboard
init();
