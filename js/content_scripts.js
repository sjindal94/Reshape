console.log("it works");
document.body.style.backgroundColor = "white";
chrome.storage.sync.get("lzoom", function (obj) {  
    console.log("Passed successfully: Username "+obj.username)
    studentUsername = obj.username; 
});