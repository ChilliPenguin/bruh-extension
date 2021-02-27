var Refresh = false;
document.addEventListener('DOMContentLoaded',function () {
    chrome.storage.local.get(['BruhButtonOn'], function(items){
        document.getElementById("BruhButton").checked = items.BruhButtonOn;
    });
    document.getElementById("BruhButton").addEventListener("click", BruhClicked, false);
}, false);

function BruhClicked(){
    chrome.tabs.query({currentWindow: true,active: true},
        function (tabs) {
            if(document.getElementById("BruhButton").checked){
                chrome.tabs.sendMessage(tabs[0].id, 'BruhOn');
                chrome.storage.local.set({ "BruhButtonOn": true });
            }else if(!document.getElementById("BruhButton").checked){
                chrome.tabs.sendMessage(tabs[0].id, 'BruhOff');
                chrome.storage.local.set({ "BruhButtonOn": false });
                chrome.storage.local.get({'AutoRefresh':true}, function(items){
                    if(items.AutoRefresh){
                        chrome.tabs.sendMessage(tabs[0].id, "Refresh");
                    }
                });
            }
        })
 
}
