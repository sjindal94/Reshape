let circles = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let circleDomElements = [];
let svgDomElements = [];

let startTime = 0;
let times = [];
let avgTimes = [];

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

let d1 = document.getElementById('d1');
let d2 = document.getElementById('d2');
let d3 = document.getElementById('d3');

let iterations = 0;

circles.forEach((c) => {
    circleDomElements.push(document.getElementById(`c${c}`));
    svgDomElements.push(document.getElementById(`s${c}`))
});

chrome.storage.sync.set({"test1": []}, function () {
    console.log('Settings saved');
});

circleDomElements.forEach((c, i) => {
    c.addEventListener("click", function () {
        if (c.attributes.fill.value !== 'green' && c.style.fill !== 'green') {
            return
        }

        if (c.id !== 'c1') {
            let endTime = (new Date).getTime();
            times.push(endTime - startTime);

            if (c.id !== 'c9') {
                startTime = (new Date).getTime();
            }
            else {
                avgTimes.push(average(times));
                times = [];
                iterations += 1;

                if (iterations < 3) {
                    [d1, d2, d3].forEach((d) => {
                        d.style.width = `${d.offsetWidth * 1.3}px`;
                        d.style.height = `${d.offsetHeight * 1.3}px`;
                    });
                }
                else {
                    console.log('Final average times:', avgTimes);
                    chrome.storage.sync.set({"test1": avgTimes}, function () {
                        console.log('Settings saved');
                    });
                    window.location.href = "../games/test2.html";
                }
            }
        }
        else {
            startTime = (new Date).getTime();
        }

        if (iterations < 2) {
            circleDomElements.map((c1, j) => {
                if (c1 === c) {
                    c1.style.fill = 'red'
                }
                else if (j === (i + 1) % circles.length) {
                    if (j === 0) {
                        c.style.fill = 'transparent'
                    }
                    c1.style.fill = 'green'
                }
                else {
                    c1.style.fill = 'transparent'
                }
            });
        }
        else {
            circleDomElements.map((c1, j) => {
                if (iterations === 2) {
                    c1.setAttribute("cx", `25px`);
                    c1.setAttribute("cy", `25px`);
                    c1.setAttribute("r", `20px`);

                    [d1, d2, d3].forEach((d) => {
                        d.style.width = `300px`;
                        d.style.height = `100px`;
                    });
                }
                else if (iterations === 4) {
                    c1.setAttribute("cx", `12.5px`);
                    c1.setAttribute("cy", `12.5px`);
                    c1.setAttribute("r", `10px`);
                }

                if (c1 === c) {
                    c1.style.fill = 'red'
                }
                else if (j === (i + 1) % circles.length) {
                    if (j === 0) {
                        c.style.fill = 'transparent'
                    }
                    c1.style.fill = 'green'
                }
                else {
                    c1.style.fill = 'transparent'
                }
            });
        }
    });

});

let skipBtn = document.getElementById('skip');
skipBtn.addEventListener("click", () => {
    window.location.href = 'test2.html';
});