document.addEventListener('DOMContentLoaded',function () {
    document.getElementById("BruhButton").addEventListener("click", BruhClicked, false);
    function BruhClicked(){
        chrome.tabs.query({currentWindow: true,active: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'change');
        });
    }
}, false);
