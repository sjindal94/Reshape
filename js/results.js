let t1_res = 0;
let t2_res = 0;
let t3_res = 0;

function add(a, b) {
    return a + b;
}

chrome.storage.sync.get({"test1": []}, (items) => {
    console.log(items.test1);
    t1_res = items.test1.reduce(add, 0) / items.test1.length;

    document.getElementById('test1').innerHTML = `${(t1_res / 1000).toFixed(2)}s`;
});

chrome.storage.sync.get({"test2": []}, (items) => {
    console.log(items.test2);
    t2_res = items.test2.reduce(add, 0) / items.test2.length;

    document.getElementById('test2').innerHTML = `${(t2_res / 1000).toFixed(2)}s`;
});

chrome.storage.sync.get({"test3": []}, (items) => {
    console.log(items.test3);
    t3_res = items.test3.reduce(add, 0) / items.test3.length;

    document.getElementById('test3').innerHTML = `${(t3_res / 1000).toFixed(2)}s`;
});

let btn = document.getElementById('goToSpeech');
btn.addEventListener("click", () => {
    window.location.href = '../voiceInstructions.html';
});