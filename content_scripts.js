console.log("it works");
document.body.style.backgroundColor = "white";
chrome.storage.sync.get("lzoom", function (obj) {  
    console.log("Passed successfully: Username "+obj.username)
    studentUsername = obj.username; 
});
/*function walkDOM(main) {
    var arr = [];
    var count=0;
    var loop = function(main) {
        do {
            arr.push(main);
            count++;
            if(count==5) break;
            if(main.hasChildNodes())
            	console.log("hey");
                loop(main.firstChild);
        }
        while (main = main.nextSibling && count<5);
    }
    loop(main);
    console.log(arr);
}
walkDOM(document.body);*/
//document.body.style.zoom = "110%" 