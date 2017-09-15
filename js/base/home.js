function home(){
  var skills = d3.select('#skills'),
      dur = 500,
      languages = jekyllData.skills[0].members;

  bar();
  bar();
  $( window ).resize(bar)

  function bar(){
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
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

    var svg = skills.select('svg');

    updateChart(languages);
    function updateChart(data){
      data = data.map(adjustProficiency);
      function adjustProficiency(d){
        var now = new Date(), // current timestamp
          last = d3.timeParse('%m/%Y')(d.last), // last timestamp, parsed
          months = new Date(70,d.months); // months parsed

        if(last === null){ last = now; }

        var timeSince = now - last,
          adjustment = months - timeSince,
          adjustedProf = adjustment,
          da = 1000*60*60*24*30;

        d.timeSince = timeSince/da
        d.adjustedProf = adjustedProf/da;

        return d;
      }

      x.domain(data.sort(function(a,b){ return b.adjustedProf - a.adjustedProf; }).map(function(d) { return d.name; }));
      var min = d3.min(data, function(d) { return d.adjustedProf; }),
        max = d3.max(data, function(d) { return d.adjustedProf; });
      y.domain([min,max]).nice();

      if(svg.empty()){
        svg = skills.append("svg")
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("text")
            .attr("class", "title")
            .text("Language Proficiency, (Months Used - Months Since Last Use)");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

        svg.append("g")
            .attr("class", "y axis");
      }

      svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
      svg.select('.title')
        .attr("x", x(data[0].name))
        .attr("y", -26);
      svg.select('.x.axis').call(xAxis)
        .selectAll('.tick text')
          .call(wrap, x.bandwidth());
      svg.select('.y.axis').call(yAxis);

      var bars = svg.selectAll(".bar")
          .data(data);

      bars.enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.name); })
          .attr("y", function(d) { return y(y.domain()[0]); })
          .attr("height", function(d) { return 0; })
          .attr("width", x.bandwidth())
      bars
        .attr("width", x.bandwidth())
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.adjustedProf); })
        .attr("height", function(d) { return height - y(d.adjustedProf); })
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
