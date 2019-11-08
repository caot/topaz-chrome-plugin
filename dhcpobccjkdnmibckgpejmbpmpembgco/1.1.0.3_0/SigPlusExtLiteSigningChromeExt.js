document.documentElement.setAttribute('SigPlusExtLiteExtension-installed', true);
var message = null;
function SignStart(evt) {
    //alert('messageData');
    message = evt.target.getAttribute("messageAttribute");
    // parse the received Json text message to JSON object
    // if not the message is adding quotes and serialize error in sigcapture
    message = JSON.parse(message);
    chrome.runtime.sendMessage({ openUrlInEditor: message }, function(response) {
        // alert(response);  
    });
    return false;
}

function SendResponseData(response) {
    var responseData = JSON.stringify(response);
    var element = document.createElement("MyExtDataElem");
    element.setAttribute("msgAttribute", responseData);
    document.documentElement.appendChild(element);
    var evt = document.createEvent("Events");
    evt.initEvent("SignResponse", true, false);
    element.dispatchEvent(evt);
}

// add listener to call the event
document.addEventListener("SignStartEvent", SignStart, false, true);
	