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
let options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let correctNum = 1;
let start;
let delta;
let count = 0;

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
    if(count>=1){

        chrome.storage.sync.get({
                        "lzoom": 0
                      }, function(items) {
                        console.log(items.lzoom.toString());
        });
        dummyzoom = 150;
        chrome.tabs.query({active:true}, function (result) {
            for (i = 0; i < result.length; i++) {    
                chrome.tabs.executeScript(result[i].id, {
                    code: 'document.body.style.zoom = "'+dummyzoom+'%";'
                });
            }
        });
    }
    else if (d === correctNum) {
        count++;
        delta = Date.now() - start;
        document.getElementById("display").innerHTML = "" + delta / 1000 + " seconds have elapsed.";
        setNum();
    }
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
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
