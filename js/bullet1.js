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
function updateBullet(year, yearData) {
    console.log("here1");
    d3.select("#svg3").selectAll("*").remove()
    var margin3 = {top: 5, right: 40, bottom: 20, left: 190},
    width3 = 960 - margin3.left - margin3.right,
    height3 = 50 - margin3.top - margin3.bottom;

    console.log(d3.version)

    var chart3 = d3.bullet()
        .width(width3)
        .height(height3);

    d3.json("../bullet.json", function(error, data) {
    if (error) throw error;
    data = data[year][mapping[yearData.data.name]];
    console.log(data);
    var svg3 = d3.select("#svg3").selectAll("svg")
        .data(data)
        .enter().append("svg")
        .attr("class", "bullet")
        .attr("width", width3 + margin3.left + margin3.right)
        .attr("height", height3 + margin3.top + margin3.bottom)
        .append("g")
        .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")")
        .call(chart3);

    var title = svg3.append("g")
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + height3 / 2 + ")");

    title.append("text")
        .attr("class", "title")
        .text(function(d) { return d.title; });

    });
}