var start = 2009;
var end = 2016;
var now = "";

// var svg = d3.select("#svg1"),
//     margin = 20,
//     diameter = +svg.attr("width"), // 以svg的宽度来作为直径的长度
//     g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

//     var color = d3.scaleLinear()
//     .domain([-1, 5])
//     .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
//     .interpolate(d3.interpolateHcl);

//     var pack = d3.pack() // 创建一个包布局，返回包布局函数pack()
//     .size([diameter - margin, diameter - margin]) // 设置包布局的宽、高尺寸
//     .padding(2);

function process(d){
    var currentTime = document.getElementById("limit").value;
    console.log(currentTime)
    console.log(d.data);
    update(currentTime, d);
    updateBullet(currentTime, d);

}

function init(){
    now = document.getElementById("limit").value;
    document.querySelector('#svg1').innerHTML = '';
    document.getElementById("nowYear").innerHTML = now;
    var svg = d3.select("#svg1");
    // svg.remove();
    var margin = 20,
    diameter = +svg.attr("width"), // 以svg的宽度来作为直径的长度
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(200,100%,80%)", "hsl(240,95%,30%)"])
    .interpolate(d3.interpolateHcl);

    var pack = d3.pack() // 创建一个包布局，返回包布局函数pack()
    .size([diameter - margin, diameter - margin]) // 设置包布局的宽、高尺寸
    .padding(2);
    // d3.select("#svg1").selectAll('*')
    // .remove();   

    d3.json("flare.json", function(error, root) { // 引入数据
        if (error) throw error;
        root = root[now];
      
          // d3.hierarchy函数用来从层次型的数据构造根节点root及其递归的下属节点,计算并为每个节点添加
          // depth,height,parent,value属性
        root = d3.hierarchy(root)
            .sum(function(d) { return d.size; }) // 对每一个父节点来说，将其所有子节点的size属性的值相加，作为该父节点的value的值，叶子节
                                                  // 点的size值作为其value值
            .sort(function(a, b) { return b.value - a.value; }); // 对节点按照value属性值进行排序
      
        var focus = root,
            nodes = pack(root).descendants(),
            view;
        var circle = g.selectAll("circle")
          .data(nodes)
          .enter().append("circle")
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .style("fill", function(d) { return d.children ? color(d.depth) : null; })
            .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); process(d)});
          
        var text = g.selectAll("text")
          .data(nodes)
          .enter().append("text")
            .attr("class", "label")
            .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
            .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
            .text(function(d) { return d.data.name; });
      
        var node = g.selectAll("circle,text");
      
        svg.style("background", color(-1))
            .on("click", function() { zoom(root);});
      
        zoomTo([root.x, root.y, root.r * 2 + margin]);
      
        function zoom(d) {
          var focus0 = focus; focus = d;
      
          var transition = d3.transition()
              // .duration(d3.event.altKey ? 7500 : 750) // alt被按下的话延时为7500
              .tween("zoom", function(d) { // tween(name, 函数) 补间动画
                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                return function(t) { zoomTo(i(t)); };
              });
      
          transition.select("#svg1").selectAll("text")
            .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
              .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
              .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
              .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }
      
        function zoomTo(v) {
          var k = diameter / v[2]; view = v;
          node.attr("transform", function(d) { ; return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
          circle.attr("r", function(d) { return d.r * k; });
        }
      
      });
}
init();
function valChange(e){
    console.log(document.getElementById("limit").value)
    init();
}