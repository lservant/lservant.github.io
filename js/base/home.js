function home(){
  var skills = d3.select('#skills'),
      dur = 500,
      languages = jekyllData.skills[0].members;

  bar();

  function bar(){
    var margin = {top: 80, right: 180, bottom: 80, left: 180},
      width = skills.node().getBoundingClientRect().width - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1,0.2);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    var svg = skills.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    processData(languages)

    function processData(data){
      x.domain(data.sort(function(a,b){ return b.prof - a.prof; }).map(function(d) { return d.name; }));
      y.domain([
        d3.min(data, function(d) { return d.prof*0.9; }),
        d3.max(data, function(d) { return d.prof*1.1; })
      ]).nice();

      function createBarChart(){
        svg.append("text")
            .attr("class", "title")
            .attr("x", x(data[0].name))
            .attr("y", -26)
            .text("Languages");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .selectAll(".tick text")
            .call(wrap, x.bandwidth());

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
      }

      createBarChart();

      var bars = svg.selectAll(".bar")
          .data(data);

      bars.enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.name); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.prof); })
          .attr("height", function(d) { return height - y(d.prof); })
          .attr('fill', function(d) { return color(d.name); });
    }

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

  }
}

home();
