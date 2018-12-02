const distances = [300];
let dragItem = document.querySelector("#item");
let container = document.querySelector("#container");
let bar = document.querySelector("#bar");
let shadow = document.querySelector("#shadow");
let count = 0;
let direction = 1;
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let start;
let total = 0;
let delta = [];

let average_times = [];

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);


init();


chrome.storage.sync.set({"test3": []}, function () {
    console.log('Average times saved');
});

init(direction);

function init() {
    bar.style.backgroundColor = "#89b4c7";
    setTranslate(direction * -distances[0] / 2, 0, dragItem);

    xOffset = direction * -distances[0] / 2;
    yOffset = 0;

    setTranslate(direction * distances[0] / 2 - 15, 0, bar);
}

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    start = Date.now();

    if (e.target === dragItem) {
        active = true;
    }
}

function dragEnd(e) {
    initialX = 0;
    initialY = 0;
    yOffset = 0;
    xOffset = -distances[0] / 2 * direction;
    setTranslate(-distances[0] / 2 * direction, 0, dragItem);
    active = false;
    if (Math.abs(currentX) > 150 && currentX * direction > 0) {
        direction = -1 * direction;
        total += (Date.now() - start);
        console.log(Date.now() - start);
        count++;
        average_times.push(total / count);
        document.getElementById("text").innerText = "Average Time: " + total / count / 1000;
        console.log(count);
        if (count < 3) {
            init();
        }
        else {
            console.log(count);
            chrome.storage.sync.set({"test3": average_times}, function () {
                console.log('Average times saved');
            });
            window.location.href = 'results.html';
        }
    }

}

function drag(e) {
    if (active) {

        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem);

        if (Math.abs(currentX) > 150 && currentX * direction > 0) {
            bar.style.backgroundColor = "#60C8EB";
        }
        else {
            bar.style.backgroundColor = "#89b4c7";
        }
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

let skipBtn = document.getElementById('skip');
skipBtn.addEventListener("click", () => {
    window.location.href = 'results.html';
});