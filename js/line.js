console.log("here");

var mapping = {
  "理化指标": "a",
  "碱度": "b",
  "矿化度": "c",
  "非工业级重金属": "d" ,
  "微生物": "e",
  "化学需氧量": "f",
  "农药类营养物质": "g",
  "生化需氧量": "h",
  "溶解氧": "i",
  "有机毒物": "j",
  "多环芳烃、PCB、清洁剂类": "k",
}

var parseTime = d3.timeParse("%Y");

function type(d, _, columns) {
  d.year = parseTime(d.year);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}
function update(currentTime, yearData){
    d3.select("#svg2").selectAll("*").remove()
    var svg1 = d3.select("#svg2"),
            margin1 = {top: 20, right: 80, bottom: 30, left: 50},
            width = svg1.attr("width") - margin1.left - margin1.right,
            height = svg1.attr("height") - margin1.top - margin1.bottom,
            g1 = svg1.append("g").attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");
        


    var x1 = d3.scaleTime().range([0, width]),
      y1 = d3.scaleLinear().range([height, 0]),
      z1 = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
      .curve(d3.curveBasis)
      .defined(function(d) {return d.temperature != null && d.temperature != NaN} )
      .x(function(d) { return x1(d.year); })
      .y(function(d) { return y1(d.temperature); });


    var fileName = "../data/line/"+mapping[yearData.data.name]+".csv"
    d3.csv(fileName, type, function(error, data) {
    if (error) throw error;
      console.log(data)
    // var cities = data.columns.slice(1).map(function(id) {
    //   return {
    //     id: id,
    //     values: data.map(function(d) {
    //       return {date: d.year, temperature: d[id]};
    //     })
    //   };
    // });


    var cities = data.columns.slice(1).map(function(id) {    
      dataWithNaN = data.map(function(d) {
        return {year: d.year, temperature: d[id]};
      });
      var fltData = dataWithNaN.filter(function(d) { return !isNaN(d.temperature)});
      return {
        id: id,
        values: fltData.map(function(d) {
          return {year: d.year, temperature: d.temperature};
        })
      };
    });
    
    console.log(cities);

    x1.domain(d3.extent(data, function(d) { return d.year; }));

    y1.domain([
      d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
      d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
    ]);

    z1.domain(cities.map(function(c) { return c.id; }));

    g1.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x1));

    g1.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y1))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("value");

    var city = g1.selectAll(".city")
      .data(cities)
      .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z1(d.id); });

    city.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x1(d.value.year) + "," + y1(d.value.temperature) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.id; });
    });
}
