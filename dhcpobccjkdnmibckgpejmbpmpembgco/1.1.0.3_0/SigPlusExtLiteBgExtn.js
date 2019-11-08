var obj = null;
var messagepost = null;
var port = null;
var tabID = null;


chrome.runtime.onMessage.addListener(function(request) {
    //alert('fire');
    var result = null;
    console.log("Tz SigPlusExtLite Chrome Background Extension - onMessage() called.");
    if (request.openUrlInEditor) {
        var hostName = "com.topaz.sigplusextlite.win";
        console.log("Tz SigPlusExtLite Chrome Background Extension - Before connectNative")
        if (port == null) {

            chrome.tabs.query({ url: request.siteUrl, currentWindow: true, active: true }, function(arrayOfTabs) {
                // currentWindow:true,
                // since only one tab should be active and in the current window at once
                // the return variable should only have one entry			
                tabID = arrayOfTabs[0].id;
                console.log("Tz SigPlusExtLite Chrome Background Extension - current Tab ID " + tabID);
            });


            messagepost = request.openUrlInEditor;
            port = chrome.runtime.connectNative(hostName);
            console.log("Tz SigPlusExtLite Chrome Background Extension - After connectNative");
            if (port != null) {
                console.log("Tz SigPlusExtLite Chrome Background Extension - Connected");
            }
            console.log("Tz SigPlusExtLite Chrome Background Extension - After Connection succeed");
            port.onMessage.addListener(onNativeMessage);
            port.onDisconnect.addListener(onDisconnected);
            sendNativeMessage();
            return true;
        }
        else if (port != null) {
            console.log("Tz SigPlusExtLite Chrome Background Extension - Port is not null");
            var json = { isSigned: false, imageData: null, rawData: null, sigString: null, padInfo: null, errorMsg: "SigCapture failed to start, another instance already running." };
            var obj = JSON.stringify(json);
            chrome.tabs.executeScript(null, { code: 'SendResponseData(' + obj + ');' });
        }
    }
});

// Receiving response from Native Host (onNativeMessage Event)
function onNativeMessage(message) {
    console.log("Tz SigPlusExtLite Chrome Background Extension -onNativeMessage  : " + message);
    var message1 = message;
    var obj = JSON.stringify(message1);

    // alert("tabID:"+tabID);
    chrome.tabs.executeScript(tabID, { code: 'SendResponseData(' + obj + ');' });
}

// Disconnect (onDisconnected Event)
function onDisconnected() {
    console.log("Tz SigPlusExtLite Chrome Background Extension - chrome.runtime.lastError.message : " + chrome.runtime.lastError.message);
    console.log("Disconnected");
    port = null;
    if(chrome.runtime.lastError.message == "Specified native messaging host not found.")
	{
		alert("Topaz SigPlusExtLite SDK is not installed.");
		return;
	}
}

function sendNativeMessage() {
    //alert(messagepost);
    console.log("Post message: " + messagepost);
    var obj = JSON.parse(JSON.stringify(messagepost));
    console.log("Object : " + obj);
    port.postMessage(messagepost);
}
   
 
 