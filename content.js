var StartChanging = false;

var blockedtext = /[\w]/g;
var dontchange = /[\d`~!@#$%^&*()_+-={}.,><;:'"?]/g;

var observer = new MutationObserver(function (m) {
    m.forEach(function(mut){
         if(mut.addedNodes.length){
            for(var an =0;an<mut.addedNodes.length;an++){
                changeText(mut.addedNodes[an].querySelectorAll("*"));
            }
        }
    })
})
chrome.runtime.onMessage.addListener(function (request) {    
    observer.observe(document.body, {childList: true,subtree: true});
    StartChanging = true;
    var elements = document.querySelectorAll("body, body *");
    changeText(elements);
});
String.prototype.replaceAt = function(index, replacement, caseSensitive = false){
    //checks if char should match orginal char's case
    //Warning: This can also be used to divide Words without spaces-> impliment
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
    var previndex = [];
    //Goes through each element
    for(var i = 0; i < elementes.length; i++) {
        //goes through each child of element
        for(var c = 0; c< elementes[i].childNodes.length;c++){
            child = elementes[i].childNodes[c];
            //checks if 
            console.log(child);
            if(elementes[i].hasChildNodes() && child.nodeType == 3 && blockedtext.test(child.textContent) && elementes[i].tagName.toUpperCase() !== 'SCRIPT'&&elementes[i].tagName.toUpperCase() !== 'STYLE'&& elementes[i].tagName.toUpperCase() !== 'NOSCRIPT') {
                var strlength = child.textContent.length;
                var statlen = strlength;
                var textarray = child.textContent.split(' ');
                var textarrayfinal = child.textContent.split(' ');
                for(var a = 0; a< textarray.length;a++){
                    var currentlength = textarray[a].length;
                    if(currentlength >3){
                        //checks each char of org string
                        previndex = [-1];
                        for(var eachchar = 0;eachchar<textarrayfinal[a].length;eachchar++){
                            //checks if char should be changed
                            if(dontchange.test(textarrayfinal[a][eachchar])){
                                previndex.push(eachchar);
                            }
                            if(eachchar == textarrayfinal[a].length-1){
                                previndex.push(eachchar+1);
                                for(var b = 0;b<previndex.length-1;b++){
                                    if((previndex[b+1]-previndex[b])>3){

                                        for(var iter = 1;iter<(previndex[b+1]-previndex[b])+1;iter++){                 
                                            switch(iter){
                                                case 1:
                                                    textarray[a]=textarray[a].replaceAt(previndex[b]+iter, "b",true);
                                                     break;
                                                case 2: 
                                                    textarray[a]=textarray[a].replaceAt(previndex[b]+iter, "r",true);
                                                    break;
                                                case 3:
                                                    textarray[a]=textarray[a].replaceAt(previndex[b]+iter, "u",true);
                                                     break;
                                                case (previndex[b+1]-previndex[b]): break;
                                                default: textarray[a]=textarray[a].replaceAt(previndex[b]+iter, "h",true);
                                            }
                                        }
                                    }
                                }
                                
                            }
                        }
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