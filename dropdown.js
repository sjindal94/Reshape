/*
var distances = [5,10,15,20];
var svgWidth = 500,svgHeight = 300,radius=10;
var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height",svgHeight);
var origin = svg.selectAll('circle')
    .data(distances)
    .enter()
    .append("circle")
    .attr("cy",svgHeight/2)
    .attr("cx",function(d){return (svgWidth-d)/2-radius})
    .attr("r",radius)
  //  .on("mouseover",handleMouseOver)
    //.on("mouseout",handleMouseOut);
*/
var options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var correctNum = 1;
var start;
var delta;

setNum();

let btn = document.getElementById('btn');
btn.addEventListener("click", show);

d3.selectAll("#myDropdown")
    .selectAll("a")
    .data(options)
    .enter()
    .append("a")
    .attr("href", "#")
    .text(function (d) {
        return d
    })
    .on("click", handleClick)

function show() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function setNum() {
    start = Date.now();
    correctNum = getRandomInt(1, options.length + 1)
    document.getElementById("number").innerHTML = "Select " + correctNum + ":";
}

function handleClick(d) {
    if (d === correctNum) {
        delta = Date.now() - start;
        document.getElementById("display").innerHTML = "" + delta / 1000 + " seconds have elapsed.";
        setNum();
    }
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
