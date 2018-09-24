
function load_data(clicked_id, cases)
{
  console.log(clicked_id);
}

var myJson;

var win = window, docm = document, em = docm.documentElement, gin = document.body;

var x_dim = win.innerWidth || em.clientWidth || gin.clientWidth;
var y_dim = win.innerHeight || em.clientHeight || gin.clientHeight;

var margin = {top: 0.1*y_dim, right: 0.3*x_dim, bottom: 0.4*y_dim, left: 0.3*x_dim},
    width = x_dim - margin.left - margin.right,
    height = y_dim - margin.top - margin.bottom;

function type(d) {
  d.frequency = +d.frequency;
  return d;
}

function drawGraph(data){
x.domain(data.map(function(d) { return d._id; }));
y.domain([0, d3.max(data, function(d) { return d.count; })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x",-170)
    .attr("y", -70)
    .attr("dy", ".91em")
    .style("text-anchor", "end")
    .text("Pending case %");

svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d._id); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.count); })
    .attr("height", function(d) { return height - y(d.count); })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .on('click', function(d){
	if(!event.detail || event.detail == 1){
          console.log(d._id);
          user_input.api = user_input.api + '/' + d._id;
	  svg.selectAll("*").remove();
	}
	})
}

async function userAction (api) {
  var response = await fetch('localhost:3000/'+api);
  if(response.ok){
	  myJson = await response.json(); //extract JSON from the http response
	  console.log(myJson);
	  drawGraph(myJson);
	} else{
		console.log('Resource not found');
		user_input.api = "users";
	}
}



var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Name:</strong> <span style='color:red'>" + d._id + "</span>";
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

var user_input = {
	apistring: "users",
	get api() {
		return this.apistring;
	},
	set api(choice) {
		this.apistring = choice;
		userAction(choice);
	}
}


userAction(user_input.api);



