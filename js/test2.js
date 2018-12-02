let options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let correctNum = 1;
let start;
let delta;
let count = 0;
let zoomLevel = 100;
let times = [];

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
    .on("click", handleClick);

chrome.storage.sync.set({"test2": []}, function () {
    console.log('Settings saved');
});


function show() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function setNum() {
    start = Date.now();
    correctNum = getRandomInt(1, options.length + 1);
    document.getElementById("number").innerHTML = `${correctNum}`;
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

function handleClick(d) {
    let dummyzoom;

    if (count === 3) {
        chrome.storage.sync.get({
            "lzoom": 0
        }, function (items) {
            console.log(items.lzoom.toString());
        });

        dummyzoom = 150;
        chrome.tabs.query({active: true}, function (result) {
            for (i = 0; i < result.length; i++) {
                chrome.tabs.executeScript(result[i].id, {
                    code: 'document.body.style.zoom = "' + dummyzoom + '%";'
                });
            }
        });

        chrome.storage.sync.set({"test2": times}, function () {
            console.log('Settings saved');
        });

        window.location.href = "../games/test3.html"
    }
    else if (d === correctNum) {
        count++;
        delta = Date.now() - start;
        times.push(delta);
        document.getElementById("display").innerHTML = "" + delta / 1000 + " seconds have elapsed.";
        //PUT IN DATA STORAGE HERE!!!!!!
        setNum();
    }
}