// @TODO: YOUR CODE HERE!
var journalismData = []

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

 // Append an SVG group
 var chartGroup = svg.append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`);

 //   // Retrieve data from the CSV file and execute everything below
 var file = "../assets/data/data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
  throw error;
}


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
                      .domain([d3.min(journalismData, d => d[chosenXAxis]),
                       d3.max(journalismData, d => d[chosenXAxis])
    ])
    .range([0, width])
    .nice();

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating yAxis var upon click on axis label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  // function render new circles
function renderCircles(theCircles, circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    addTextToCircles(theCircles, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)
  
    return circlesGroup;
  }
  
  // function used for updating x-scale var upon click on axis label
  function yScale( chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
                        .domain([d3.min(journalismData, d => d[chosenYAxis]), d3.max(journalismData, d => d[chosenYAxis])])
                        .range([height, 0]);
    return yLinearScale;                      
  }
  
  //function add the text to circles
function addTextToCircles( theCircles, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis){
 
    theCircles.selectAll("#circle-text").remove();
  
    theCircles.append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(d => d.abbr)
    // Now place the text using our scale.
    .attr("dx",  d => xLinearScale(d[chosenXAxis]-.1))
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.    
    .attr("dy", d => yLinearScale(d[chosenYAxis]+0.2) + 15 / 2.5)
    .attr("id", "circle-text")
    .attr("font-family", "Arial")
    .attr("font-size", "10px")
    .attr("fill", "white")   
  }
  
  //function add X labels group
  function addXlabel(labelsXGroup, value, text, yloc, isActive){
    var xLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", yloc)
    .attr("value", value) // value to grab for event listener
    .classed(isActive, true)
    .text(text);
  
    return xLabel;
  }

  //function add Y labels group
function addYlabel(labelsYGroup, value,text, xloc, yloc, isActive ){

    var yLabel = labelsYGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", yloc)
    .attr("x", xloc)
    .attr("dy", "1em")
    .attr("value", value) // value to grab for event listener    
    .classed("axis-text", true)
    .classed(isActive, true)    
    .text(text);  

    return yLabel;
} 

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty:";
  }
  else {
    var xlabel = "Age:";
  }

  if (chosenYAxis === "healthcare") {
    var ylabel = "Healthcare:";
  }
  else {
    var ylabel = "Smokes:";
  }  

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([10, -10])
    .html(function(d) {
      return (`${ylabel} ${d[chosenYAxis]}<br>${xlabel} ${d[chosenXAxis]}`);
    });


    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  
  // function successHandle handles the success promise 
  function successHandle(data) {
    journalismData = data;
    // parse data
    journalismData.forEach(function(d) {
        d.age = +d.age
        d.ageMoe = +d.ageMoe
        d.healthcare = +d.healthcare
        d.healthcareHigh = +d.healthcareHigh
        d.healthcareLow = +d.healthcareLow
        d.id = +d.id
        d.income = +d.income
        d.incomeMoe = + d.incomeMoe
        d.obesity = +d.obesity
        d.obesityHigh = +d.obesityHigh
        d.obesityLow = +d.obesityLow
        d.poverty = +d.poverty
        d.povertyMoe = +d.povertyMoe
        d.smokes = +d.smokes
        d.smokesHigh = +d.smokesHigh
        d.smokesLow = +d.smokesLow
    });
    console.log(journalismData);

      // xLinearScale function above csv import
  var xLinearScale = xScale(chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

   // append x axis
   var xAxis = chartGroup.append("g")
    .data(journalismData)
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

   // append y axis
   var yAxis = chartGroup.append("g")
   .data(journalismData)
   .classed("y-axis", true)
   .attr("transform", `translate(${height}, 0-${width})`)   
   .call(leftAxis);

    var theCircles = chartGroup.selectAll("g theCircles").data(journalismData).enter()
     // append initial circles
    var circlesGroup = theCircles
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))      
      .attr("r", 10)
      .attr("stroke","black")
      .attr("fill", "#5fa3ec")
      .attr("opacity", "1")

      addTextToCircles(theCircles, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis) 
    circlesGroup =  updateToolTip(chosenXAxis, chosenYAxis, circlesGroup)

      // Create group for  2 x- axis labels
      var labelsXGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    //X-Labels
    var povertyLabel = addXlabel(labelsXGroup, "poverty", "In Poverty (%)", 20, "active");    
    var ageLabel = addXlabel(labelsXGroup, "age", "# age (median)", 40, "inactive")

    // Create group for  2 y- axis labels
    var labelsYGroup = chartGroup.append("g")
      .attr("transform", `translate(${height / 2 - 150}, ${0})`);

    // append y axis
    var healthcareLabel = addYlabel(labelsYGroup, "healthcare", "Lacks Healthcare (%)", 0 - ((height / 2) -12), 0 - margin.left , "active" )
    var smokesLabel = addYlabel(labelsYGroup, "smokes", "Smokes (%)", 0 - ((height / 2) -12), 0 - margin.left -20, "inactive" )
  
    
    eventListnerXgroup(theCircles, circlesGroup, labelsXGroup, povertyLabel, ageLabel, xAxis);
    eventListnerYgroup(theCircles, circlesGroup, labelsYGroup,  healthcareLabel, smokesLabel, yAxis);

}

// function event listner for X axis
function eventListnerXgroup(theCircles, circlesGroup, labelsXGroup, povertyLabel, ageLabel, xAxis){

    console.log(circlesGroup);
    
    labelsXGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis){
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(chosenXAxis);
  
          yLinearScale = yScale(chosenYAxis);        
  
          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
          // yAxis = renderYAxes(yLinearScale, yAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(theCircles, circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
             // changes classes to change bold text
        if (chosenXAxis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
          }
  
        }
      });
  }

  // function event listner for Y axis
function eventListnerYgroup(theCircles, circlesGroup, labelsYGroup,  healthcareLabel, smokesLabel, yAxis){

    console.log(circlesGroup);
    
    labelsYGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis){
  
          // replaces chosenXAxis with value
          chosenYAxis = value;
  
          // console.log(chosenXAxis)
          xLinearScale = xScale(chosenXAxis);
          // functions here found above csv import
          // updates x scale for new data
          yLinearScale = yScale(chosenYAxis);        
  
          // updates x axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(theCircles, circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else{
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  }

  
