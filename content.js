var StartChanging = false;

var blockedtext = /[\w]/g;  //any alphabetic character
var dontchange = /[\d`~!@#$%^&*()_+-={}.,><;:'"?]/g;
blockednodes = /SCRIPT|STYLE|NOSCRIPT/g

const typeOfModifications = {
	longH:  0,
	repeat: 1,
}
typeOfModificationToUse = typeOfModifications.longH


//recognizes new additions to HTML(ie twitter generates posts as we scroll down)
let observer = new MutationObserver(function (m) 
{
        m.forEach(function(mut)
        {
            if(mut.addedNodes)
            {
                for(var an =0;an <mut.addedNodes.length;an++)
                {
                    if(mut.addedNodes[an] == undefined) break;
                        try
                        {
                            changeText(mut.addedNodes[an].querySelectorAll('*'));
                        }catch(e)
                        {
                            //Do nothing
                        }
                        
                }
            }
        })
})

//listens for an event from our popup window
chrome.runtime.onMessage.addListener(function (request) 
{
    if(request == "BruhOn")
    {
        observer.observe(document.body, {childList: true,subtree: true, attributes:false}); //starts our observer
        StartChanging = true;
        var elements = document.querySelectorAll("body, body *");
        changeText(elements);
    }else if(request == "BruhOff")
    {
        observer.disconnect();
    }
    if(request == "Refresh")
    {
        history.go(); //reloads the page!
    }
    return "thanks"
});

//sets up bruh extension
window.onload = function WindowLoad(event) { 
    chrome.storage.local.get({'IgnoreList':[]}, function(items){
        if(items.IgnoreList.length > 0)
        {
            blockednodes = new RegExp("SCRIPT|STYLE|NOSCRIPT|"+items.IgnoreList.join("|").toUpperCase(), "g");
        }else {
            blockednodes = new RegExp("SCRIPT|STYLE|NOSCRIPT","g")
        }
    })   
    chrome.storage.local.get({'BruhType':""}, function(items){
        switch(items.BruhType){
            case "LongH":
                typeOfModificationToUse = typeOfModifications.longH
                break;
            case "repeat":
                typeOfModificationToUse = typeOfModifications.repeat
                break;
        }
    })  
    chrome.storage.local.get(['BruhButtonOn'], function(items){
        if(items.BruhButtonOn){
            observer.observe(document.body, {childList: true,subtree: true, attributes:false});
            StartChanging = true;
            var elements = document.querySelectorAll("body, body *");
            changeText(elements);
        }else if(!items.BruhButtonOn){
            observer.disconnect();
        }
    });
}

String.prototype.replaceAt = function(index, replacement, caseSensitive = false){
    //checks if char should match orginal char's case
    if(caseSensitive){
        if(this[index] == this[index].toUpperCase()){
            return this.substr(0, index) + replacement.toUpperCase() + this.substr(index + replacement.length);
        }else{
            return this.substr(0, index) + replacement.toLowerCase() + this.substr(index + replacement.length);
        }
    }
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}



function changeText(elementes){
    var child;
    var arrayOfSymbols = [];
    //Goes through each element
    for(var i = 0; i < elementes.length; i++) {
        //goes through each child of element
        for(var c = 0; c< elementes[i].childNodes.length;c++){
            child = elementes[i].childNodes[c];
            //checks if child is text node and should be changed
            var dontPass = false
            fakeChild = child
            parents = []
            while (fakeChild) {
                parents.unshift(fakeChild);
                fakeChild = fakeChild.parentNode;
            }
            for(var b = 0; b< parents.length;b++) {
                
                if(parents[b] == null) {
                    continue;
                }
                if(blockednodes.test(parents[b].tagName))
                {
                    dontPass = true;
                    break;
                }
            }
            if(dontPass) 
            {
                continue;
            }
            if(elementes[i].hasChildNodes()                                     // if main has children
                && child.nodeType == 3                                          // if the child is a text node
                && blockedtext.test(child.textContent)                          // if the child text has actual characters to change
                && !blockednodes.test(elementes[i].tagName.toUpperCase())      // if the child is NOT a blockednode(SCRIPT or STYLE elements)
                )
                
                {
                var strlength = child.textContent.length;
                var statlen = strlength;
                var textarray = child.textContent.split(' ');
                var textarrayfinal = child.textContent.split(' ');
                for(var a = 0; a< textarray.length;a++){
                    var currentlength = textarray[a].length;    //length of a string
                    if(currentlength >3){   // >3 so that the word can be changed atleast into 'bruh'
                        //checks each char of org string
                        arrayOfSymbols = [-1];
                        for(var eachchar = 0;eachchar<textarrayfinal[a].length;eachchar++){
                            //checks if char should be changed
                            if(dontchange.test(textarrayfinal[a][eachchar])){   //if character is a symbol
                                arrayOfSymbols.push(eachchar);
                            }
                        }
                        arrayOfSymbols.push(textarrayfinal[a].length); //bad naming, but array of positions of characters
                        textarray[a] = setNormalTextToBruh(typeOfModificationToUse, arrayOfSymbols, textarray[a])
                    }
                }
                //Changes text to new bruhified text
                child.textContent = textarray.join(" ");
            }else if(child.nodeName.toUpperCase() === 'INPUT'){
                if(child.placeholder != ""){
                    child.placeholder = "Bruh";
                }
            }
        }
    }
}

function setNormalTextToBruh(type, symbolPositions, givenString)
{
    tempArray = givenString
    switch(type)
    {
        case typeOfModifications.longH:
            for(var b = 0;b<symbolPositions.length-1;b++)
            {
                if((symbolPositions[b+1]-symbolPositions[b])>3){    //means there is a space for a word

                    for(var iter = 1;iter<(symbolPositions[b+1]-symbolPositions[b])+1;iter++){                 
                        switch(iter){
                            case 1:
                                tempArray=tempArray.replaceAt(symbolPositions[b]+iter, "b",true);
                                    break;
                            case 2: 
                                tempArray=tempArray.replaceAt(symbolPositions[b]+iter, "r",true);
                                break;
                            case 3:
                                tempArray=tempArray.replaceAt(symbolPositions[b]+iter, "u",true);
                                    break;
                            case (symbolPositions[b+1]-symbolPositions[b]): break;
                            default: tempArray=tempArray.replaceAt(symbolPositions[b]+iter, "h",true);
                        }
                    }
                }
            }
            break
        case typeOfModifications.repeat:
            for(var b = 0;b<symbolPositions.length-1;b++)
            {
                if((symbolPositions[b+1]-symbolPositions[b])>3){    //means there is a space for a word

                    for(var iter = 1;iter<(symbolPositions[b+1]-symbolPositions[b]);iter++){            
                        switch((iter-1) % 4){
                            case 0:
                                tempArray=tempArray.replaceAt(symbolPositions[b]+iter, "b",true);
                                    break;
                            case 1: 
                                tempArray=tempArray.replaceAt(symbolPositions[b]+iter, "r",true);
                                break;
                            case 2:
                                tempArray=tempArray.replaceAt(symbolPositions[b]+iter, "u",true);
                                    break;
                            case 3: 
                                tempArray=tempArray.replaceAt(symbolPositions[b]+iter, "h",true);
                                break;
                        }
                    }
                }
            }
            break
    }
    return tempArray
}