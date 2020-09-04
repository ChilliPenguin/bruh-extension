document.addEventListener('DOMContentLoaded',function () {
    chrome.storage.local.get({'AutoRefresh':true}, function(items){
        console.log(items.AutoRefresh);
        document.getElementById("ARefresh").checked = items.AutoRefresh;
    });
    document.getElementById("ARefresh").addEventListener("click", changeValue, false);
}, false);

function changeValue(){
    chrome.storage.local.set({ "AutoRefresh": document.getElementById("ARefresh").checked });
}