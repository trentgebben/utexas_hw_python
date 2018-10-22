// from data.js
//var tableData = data;
//Get the table
var table = d3.select('#ufo-table');

// var columns = ["datetime", "city", "state", "country", "shape", "comment"]
var columns = d3.keys(data[0])


///Function build header according to data
function buildheader() {
    //Append table head
    var thead = table.append('thead')

    // append the header row
    table.select("thead").append('tr')
      .selectAll('th')
      .data(columns).enter()
      .append('th')
      .text(function (column) { return column; });

}

///funtion:  Build table
///Builds table dynamically
function buildTable(tableData){
    console.log(tableData)
    table.select('tbody').remove()
    var	tbody = table.append('tbody');
    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
        .data(tableData)
        .enter()
        .append('tr');

        // create a cell in each row for each column
	var cells = rows.selectAll('td')
		.data(function (row) {
		          return columns.map(function (column) {
		                    return {column: column, value: row[column]};
		                      });
		    })
		  .enter()
		  .append('td')
		  .text(function (d) { return d.value; });
}

// Display the table header and data
buildheader()
buildTable(data)

//Button click
//Filter value based on input datetime
submit = d3.select('#filter-btn')

submit.on("click", function(){
    // Prevent the page from refreshing
    d3.event.preventDefault();
    //get input
    var inputvalue = d3.select("#datetime")
    //Get input
    var value = inputvalue.property("value")

    //Validate input
    var dateFormat = "D/M/YYYY";
    if (moment(value, "D/M/YYYY", true).isValid() || moment(value, "D/MM/YYYY", true).isValid()) {
        console.log("Date is valid")
        d3.select("#error").text("")

        //Filter the data
        var newdata = data.filter(function(d){
            return d.datetime == value
        })
        buildTable(newdata)
    } else {
        console.log("Date is NOT valid")
        d3.select("#error").text("Date is NOT valid")
        inputvalue.property("value", "")
        inputvalue.property("placeholder", "1/11/2011")
        //If invalid data show all
        buildTable(data)
    } ; // return true
})