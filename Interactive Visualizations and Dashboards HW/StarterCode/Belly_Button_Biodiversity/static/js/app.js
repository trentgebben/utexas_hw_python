function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  
  d3.json("/metadata/" + sample).then(successhandel).catch(errorhandel)
  function successhandel(results){
    console.log(results );
    var x=Object.entries(results)
    console.log( `x:${x}`);
    var sample_data= d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    sample_data.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(results).forEach(function(currentValue , index){
      console.log(currentValue)
      sample_data.append("p").text(`${currentValue[0]}: ${currentValue[1]}`).style("font-size", "12px").style("font-weight", "bold")
    
    })
  };

  function errorhandel(error){
    console,log(error);
  };

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then(successfulfun).catch(errorfun)
  function successfulfun(data){
    // print data 
    console.log(data.otu_ids)
    console.log(data.sample_values)
    console.log(data.otu_labels)

    // @TODO: Build a Bubble Chart using the sample data
    var traceBubble = {
      x : data.otu_ids,
      y : data.sample_values,
      mode: 'markers',
      marker : { 
        color : data.otu_ids,
        size : data.sample_values,
        colorscale :'Earth'
      },
      hoverinfo :`${data.otu_ids} : ${data.otu_labels} `
    };
    
    var dataBubble = [traceBubble];
    var layout = {
      xaxis : { title : 'OTU ID' }
    };

    Plotly.newPlot("bubble", dataBubble, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var tracePie = {
      type : "pie",
      values : data.sample_values.slice(0,10),
      labels : data.otu_ids.slice(0, 10),
      textinfo : "percent",
      text : data.otu_labels.slice(0, 10),
      hoverinfo : "label,text,value,percent"
    }

    var dataPie = [tracePie]
    Plotly.newPlot("pie", dataPie)
    
    }
  
  function errorfun(error){
    console.log(error)
  }

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
