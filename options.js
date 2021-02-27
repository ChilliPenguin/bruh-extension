ignoreItems = []
document.addEventListener('DOMContentLoaded',function () {
    setUpStuff()
    chrome.storage.local.get({'AutoRefresh':true}, function(items){
        document.getElementById("ARefresh").checked = items.AutoRefresh;
    });
    chrome.storage.local.get({'BruhType':""}, function(items){
        Array.from(document.getElementsByClassName("BruhTypes")).find(x => x.value == items.BruhType).setAttribute("selected", "selected")
        checkAllValues()
    });
    chrome.storage.local.get({'IgnoreList':[]}, function(items){
        ignoreItems = items.IgnoreList
        createIgnoredListItem()
        //ignoreItems.childNodes.forEach(x => document.getElementById("BruhTypeOptions").childNodes.some(y =>y.name === x))
    });
    document.getElementById("ARefresh").addEventListener("click", changeValue, false);
    document.getElementById("dropdown-main").addEventListener("change", changeValue, false);
}, false);



function changeValue(){
    chrome.storage.local.set({ "AutoRefresh": document.getElementById("ARefresh").checked });
    var i = 0
    var selecter = document.getElementById("dropdown-main")
    
    for (;i<document.getElementsByName('BruhTypes').length;i++){
        if(document.getElementsByName('BruhTypes')[i].selected == true)
        {
            break;
        }
    }
    chrome.storage.local.set({ "BruhType":    selecter.options[selecter.selectedIndex].value});
}
function setUpStuff(){
    
    elementSearcher = new searchBox();
    document.getElementById("searchInput").addEventListener("input", function() {
        elementSearcher.recommendList(this.value)
    })
    
    document.getElementById("searchInput").addEventListener("submit", function() {
        var val = document.getElementById("searchInput").value
        document.getElementById("searchInput").value = ''
        if(ignoreItems.includes(val))
            return;
        ignoreItems.push(val)
        chrome.storage.local.set({'IgnoreList' : ignoreItems})
        addIgnoredListItem(val)
    })
    document.getElementById("searchInput").addEventListener("focus", function() {
        document.getElementById("dropdown-searcher").style ="display:flex"
    })

    document.getElementById("searchInput").addEventListener("focusout", async function () {
        await new Promise(r => setTimeout(r, 250));
        if(!["OL","LI","UL", "DIV", "INPUT"].includes(document.activeElement.tagName))
            document.getElementById("dropdown-searcher").style ="display:none";
    })
    document.getElementById("addButton").addEventListener("click", function() {
        var inputer = document.getElementById("searchInput")
        if(inputer.value != '')
        {
            var a = new Event('submit')
            inputer.dispatchEvent(a)
        }
    })
    
}
function checkAllValues(){
    for(var a = 0;a < document.getElementsByClassName("BruhTypes").length; a++)
    {
        // var element = document.getElementsByClassName("BruhTypes")[a];
        // if(element.checked){
        //     element.parentElement.style.backgroundColor  = "#d4ffd2" 
        //     element.parentElement.style.transition ="background-color .2s ease .2s";
        // }else{
        //     element.parentElement.style.backgroundColor  = "whitesmoke" 
        //     element.parentElement.style.transition ="background-color .2s ease .2s";
        // }
    }
}

function createIgnoredListItem()
{
    ignoreItems.forEach(x => {
        addIgnoredListItem(x)
    })   
}

function addIgnoredListItem(value)
{
    parent = document.getElementById("currentIgnoredElements-list").children[0]
    var child = document.createElement('li');
    child.value = value
    child.innerHTML = value
    child.addEventListener('click', function(){
        ignoreItems.splice(ignoreItems.indexOf(child.value),1);
        chrome.storage.local.set({'IgnoreList' : ignoreItems})
        child.remove()
    })
    parent.appendChild(child)
}
class searchBox
{
    constructor()
    {
        this.listOfElements = ["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","bgsound","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dir","div","dl","dt","element","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","isindex","kbd","keygen","label","legend","li","link","listing","main","map","mark","marquee","menu","menuitem","meta","meter","nav","nobr","noframes","noscript","object","ol","optgroup","option","output","p","param","plaintext","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr","xmp"]
    }
    recommendList(givenString)
    {
       
        var tempArray = []
        var a = new Event('submit')
        tempArray = this.listOfElements.filter(word => word.substring(0,givenString.length) == givenString)
        var orderedList = document.getElementById("dropdown-searcher")
        orderedList.querySelectorAll('*').forEach(n => n.remove())
        tempArray.forEach(x => {
            var child = document.createElement('li');
            
            child.addEventListener("click", function() {
                
                document.getElementById("searchInput").value = x;
                document.getElementById("searchInput").dispatchEvent(a)
                document.getElementById("dropdown-searcher").style ="display:none";
            });
            child.innerHTML   = x
            
            orderedList.appendChild(child)  
        })
    }
    
}