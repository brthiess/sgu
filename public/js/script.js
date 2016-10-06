function animateIn() {
	var elements = document.getElementsByClassName("animate");
	for(var i = 0; i < elements.length; i++){
		elements[i].className += ' animate-in ';
	}
}
function animateOut(){
	$(".animate").each(function(){
		$(this).removeClass("animate-in");
	});
}

$(document).ready(function(){
	animateIn();
});

//Listen for clicks to links
var elements = document.getElementsByTagName('a');
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function(evt) {
	evt.preventDefault();
    loadPage(this.href);
  });
}

function loadPage(url){
	console.log(url);
	animateOut();
	$.ajax({
		method: "get",
		data: {content_only: 'true'},
		url: url,
		success:function(data){
			console.log(data);
		},
		error: function(data){
			
		}
	});
}

function loadGraph(pathToData, graphType, page, transition){ 	
	if (transition){
		transitionToGraph();
	}
	history.pushState(null, page, page);
	if(graphType = 'barchart'){
		loadBarChartData(pathToData);
	}
}

function transitionToGraph(){
	var icons = document.getElementsByClassName("main-list-item");
	for(var i = 0; i < icons.length; i++){
		makeInvisible(icons[i], (i * 55));
	}
	document.getElementById("main-title").className += ' invisible ';
	document.getElementById("subtitle").className += ' invisible ';
	setTimeout(function(){document.getElementById("main-page").className += ' invisible ';}, 200);
	setTimeout(function(){document.getElementById("main-page").className += ' hidden ';}, 700);
	setTimeout(function(){document.getElementById("graph-page").className = document.getElementById("graph-page").className.replace(/\bhidden\b/,'');}, 700);
	setTimeout(function(){document.getElementById("chart").className = document.getElementById("graph-page").className.replace(/\binvisible-move-down\b/,'');}, 800);
	
}

function goToMainPage(e) {
	e.preventDefault();
	history.pushState(null, null, '/');
	transitionToMainPage();
}

function transitionToMainPage(){
	setTimeout(function(){document.getElementById("chart").className += ' invisible-move-down ';}, 0);
	setTimeout(function(){document.getElementById("graph-page").className += ' hidden ';}, 700);
	setTimeout(function(){document.getElementById("main-page").className = document.getElementById("main-page").className.replace(/\bhidden\b/,'');}, 400);
	setTimeout(function(){document.getElementById("main-page").className = document.getElementById("main-page").className.replace(/\binvisible\b/,'');}, 500);
	var icons = document.getElementsByClassName("main-list-item");
	for(var i = 0; i < icons.length; i++){
		makeVisible(icons[i], (i * 55) + 800);
	}
	setTimeout(function(){document.getElementById("main-title").className = document.getElementById("main-title").className.replace(/\binvisible\b/,'');}, 800);
	setTimeout(function(){document.getElementById("subtitle").className = document.getElementById("subtitle").className.replace(/\binvisible\b/,'');}, 800);
}


function loadBarChartData(pathToData, chartId){
	console.log(pathToData);
	makeRequest(pathToData, renderChart);
}


function makeRequest(url, callback) {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = callback;
    httpRequest.open('GET', url);
    httpRequest.send();
  }

  function renderChart() {
	var ctx = document.getElementById('chart');
	
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var parsed = JSON.parse(httpRequest.responseText);	
		console.log(parsed.default_chart_data);
		var myBarChart = new Chart(ctx, {
			type: 'bar',
			data: parsed.default_chart_data
		});
      } else {
        alert('There was a problem with the request.');
      }
    }
  }


/*
function loadBarChart(file, chartContainer){

	var margin = {top: 80, right: 180, bottom: 80, left: 180},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var svg = d3.select(chartContainer).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.tsv(file, function(error, data){

		// filter year
		var data = data.filter(function(d){return true;});
		// Get every column value
		var elements = Object.keys(data[0])
			.filter(function(d){
				return ((d != "Name"));
			});
		var selection = elements[0];

		var y = d3.scale.linear()
				.domain([0, d3.max(data, function(d){
					return +d[selection];
				})])
				.range([height, 0]);

		var x = d3.scale.ordinal()
				.domain(data.map(function(d){ return d.Name;}))
				.rangeBands([0, width]);


		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")
			.style("font-size", "8px")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", "-.55em")
			.attr("transform", "rotate(-90)" );


		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		svg.selectAll("rectangle")
			.data(data)
			.enter()
			.append("rect")
			.attr("class","rectangle")
			.attr("width", width/data.length)
			.attr("height", function(d){
				return height - y(+d[selection]);
			})
			.attr("x", function(d, i){
				return (width / data.length) * i ;
			})
			.attr("y", function(d){
				return y(+d[selection]);
			})
			.append("title")
			.text(function(d){
				return d.Name + " : " + d[selection];
			});
		/*
		var selector = d3.select("#drop")
			.append("select")
			.attr("id","dropdown")
			.on("change", function(d){
				selection = document.getElementById("dropdown");

				y.domain([0, d3.max(data, function(d){
					return +d[selection.value];})]);

				yAxis.scale(y);

				d3.selectAll(".rectangle")
					.transition()
					.attr("height", function(d){
						return height - y(+d[selection.value]);
					})
					.attr("x", function(d, i){
						return (width / data.length) * i ;
					})
					.attr("y", function(d){
						return y(+d[selection.value]);
					})
					.ease("linear")
					.select("title")
					.text(function(d){
						return d.Name + " : " + d[selection.value];
					});
		  
				d3.selectAll("g.y.axis")
					.transition()
					.call(yAxis);

			 });

		selector.selectAll("option")
		  .data(elements)
		  .enter().append("option")
		  .attr("value", function(d){
			return d;
		  })
		  .text(function(d){
			return d;
		  }) 


	});
}
*/
