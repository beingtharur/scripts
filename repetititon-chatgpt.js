const injectedJavascript = `

(function repetitionChat(buttonLabelList = []) {

    function log(logMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ key: logMessage }));
    }
    let loc = location.href;
    
    function onAutoReplyButtonClick(buttonText) {
        // console.log(document.querySelector('form textarea'));
        document.querySelector("form textarea").value = buttonText;
        document.querySelector("form button:last-child").click();
    }

    function createTextHash(text = ""){
        
        if (text.split(" ").length < 5) {
            return "recycle-bin";
            
        }
        const firstFiveWords = text.split(" ").slice(0, 5).join(" ");
        return firstFiveWords.replace(" ", "-");
    }

    function selectSaveAndPostText(){
        
        const M = []
        console.log('click')
        let b = document.getElementsByClassName("text-token-text-primary");
        
        let initialText = b[0].childNodes[0].childNodes[0].childNodes[1].innerText

        for (let i = 0; i < b.length; i++) {
            if (i%2 == 0){
                message =  b[i].childNodes[0].childNodes[0].childNodes[1].innerText
            }else {
                message = b[i].childNodes[0].childNodes[0].childNodes[1].innerText
            }
            
            console.log(message.substring(0,200))
            // saveAndPostText(message, initialText);
            M.push(message)
        }
        
        const textHash = createTextHash(initialText)
        downloadData(M, "chatgpt_" + textHash +".json")
    }

    function downloadData(data, filename = "data.json", mimeType = "application/json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: mimeType });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function postOutput() {
        let outputText = "";

        Array.from(document.querySelectorAll("form textarea, form button")).forEach(
            (item) => {
                let eventType;
                if (item.tagName.toLowerCase() == "textarea") {
                    eventType = "keyup";
                    item.addEventListener(eventType, function (event) {
                        if (event.key === "Enter") {
                            outputText = document
                                .getElementsByTagName("main")[0]
                                .innerText.slice(0, -201);
                            saveAndPostText(outputText);
                        }
                    });
                } else {
                    eventType = "click";
                    item.addEventListener(eventType, function (event) {
                        outputText = document
                            .getElementsByTagName("main")[0]
                            .innerText.slice(0, -201);
                        saveAndPostText(outputText);
                    });
                }
            }
        );
    }

    function onSummaryButtonClick() {
        const lastMessage = getLastMessage();
    }
    function detectUrlChange() {


        if (loc !== location.href) {
            // alert("loc : ",loc)
            loc = location.href;
            console.log("URL has changed to", location.href);
            reloadAutoPopulatedButtons();

            repetitionChat([
                {
                    label: "Layout",
                    button: "Teach me Webpage structure in details with code examples "
                },
                {
                    label: "HTML",
                    button: "Teach me HTML programming language from scratch with code exmaples"
                },
                {
                    label: "React Js ",
                    button: "Teach me React Js  programming language from scratch with code exmaples"
                }
            ]);
        }
    }

    function reloadAutoPopulatedButtons() {
        const autoPopulatedSection = document.getElementById(
            "auto-populated-section"
        );
        if (autoPopulatedSection) {
            autoPopulatedSection.remove();
        }
        const formParentElement = document.querySelector("form").parentElement;
        formParentElement.appendChild(getAutoPopulatedButtons(buttonLabelList));
    }

    function getLastMessage() {
        const messageNodes = document.querySelectorAll('.text-token-text-primary');
    
        if (messageNodes.length > 0) {
            const lastMessageNode = messageNodes[messageNodes.length - 1];
            const lastMessageText = lastMessageNode.innerText;
    
            // Extract JSON-like content using the updated regular expression
            const jsonRegex = /(\{[^}]*\})/g; // Match entire JSON objects
            const jsonMatches = lastMessageText.match(jsonRegex);
    
            if (jsonMatches) {
                const lastMessageJsonText = jsonMatches.join(''); // Combine matched JSON objects
    
                // Log for debugging
                alert("Summary posted discord : " + lastMessageJsonText);
                window.ReactNativeWebView.postMessage(JSON.stringify({ key: lastMessageJsonText }));
    
                try {
                    const lastMessageJson = JSON.parse(lastMessageJsonText);
    
                    // Log for debugging
                    console.log("Parsed JSON:" + JSON.stringify(lastMessageJson));
    
                    return lastMessageJson;
                } catch (error) {
                    // Handle JSON parsing error
                    console.log("Error parsing JSON in last message:" + error.message);
                    return null;
                }
            } else {
                // Handle the case where JSON-like content was not found
                console.log("JSON-like content not found in last message");
                return null;
            }
        } else {
            // Handle the case where there are no message nodes
            console.log("No messages found on the page");
            return null;
        }
    }
    
    
    
    

    function getAutoPopulatedButtons(buttonContentList = []) {
        try {
            document.getElementById("auto-populated-section").remove();
        } catch {
            console.log("auto-populated-div not found");
        }
        
            
            let autoPopulatedDiv = document.createElement("div");
            autoPopulatedDiv.id = "auto-populated-section";
            autoPopulatedDiv.style.display = "flex";
            autoPopulatedDiv.style.flexDirection = "row";
            autoPopulatedDiv.style.justifyContent = "center";
            autoPopulatedDiv.style.alignItems = "center";
            for (let buttonData of buttonContentList) {
                let AutoReplyButton = document.createElement("button");
                AutoReplyButton.className = "auto-populate-button";
                AutoReplyButton.style.paddingLeft = "15px";
                AutoReplyButton.style.paddingRight = "15px";
                AutoReplyButton.style.paddingTop = "5px";
                AutoReplyButton.style.paddingBottom = "5px";
                AutoReplyButton.style.fontSize = "14px";
                AutoReplyButton.style.backgroundColor = "#e6e6e6";
                AutoReplyButton.style.borderRadius = "5px";
                AutoReplyButton.style.margin = "4px";
        
                AutoReplyButton.innerText = buttonData.label;
                AutoReplyButton.addEventListener("click", () => onAutoReplyButtonClick(buttonData.button));
                autoPopulatedDiv.appendChild(AutoReplyButton);
            }
            let summaryButton = document.createElement("button");
            summaryButton.className = "auto-populate-button-summary";
            summaryButton.style.paddingLeft = "15px";
            summaryButton.style.paddingRight = "15px";
            summaryButton.style.paddingTop = "5px";
            summaryButton.style.paddingBottom = "5px";
            summaryButton.style.backgroundColor = "#e6e6e6";
            summaryButton.style.borderRadius = "5px";
            summaryButton.style.margin = "4px";
            summaryButton.style.fontSize = "14px";
            summaryButton.innerText = "Summary";
            summaryButton.addEventListener("click", onSummaryButtonClick);
            autoPopulatedDiv.appendChild(summaryButton);
            return autoPopulatedDiv;
        }

    
    document
        .querySelector("form")
        .parentElement.appendChild(getAutoPopulatedButtons(buttonLabelList));

    setInterval(function () {
        detectUrlChange();
    }, 5000);
})([
    {
        label: "Layout",
        button: "Teach me Webpage structure in details with code examples "
    },
    {
        label: "HTML",
        button: "Teach me HTML programming language from scratch with code exmaples"
    },
    {
        label: "React Js ",
        button: "Teach me React Js  programming language from scratch with code exmaples"
    }
]);

let outputText = "";
// Define the function to update the textarea

function updateTextAreaWithCode(code) {
    const textarea = document.querySelector("form textarea");
    if (textarea) {
        textarea.value = code;
        // Trigger an input event to notify any listeners (e.g., GPT) about the change
        const inputEvent = new Event("input", { bubbles: true });
        textarea.dispatchEvent(inputEvent);
    }
}

// Handle messages from React Native
window.addEventListener("message", function (event) {
    const data = JSON.parse(event.data);
    if (data.type === "updateCode") {
        updateTextAreaWithCode(data.code);
    }
});


(function () {
    Array.from(document.querySelectorAll("form textarea, form button")).forEach(
        (item) => {
            let eventType;
            if (item.tagName.toLowerCase() == "textarea") {
                eventType = "keyup";
                item.addEventListener(eventType, function (event) {
                    console.log("event", event.key);
                    if (event.key === "Enter") {
                        outputText = document
                            .getElementsByTagName("main")[0]
                            .innerText.slice(0, -201);
                        window.ReactNativeWebView.postMessage(
                            JSON.stringify({ key: outputText })
                        );
                    }
                });
            } else {
                eventType = "click";
                item.addEventListener(eventType, function (event) {
                    outputText = document
                        .getElementsByTagName("main")[0]
                        .innerText.slice(0, -201);
                    window.ReactNativeWebView.postMessage(
                        JSON.stringify({ key: outputText })
                    );
                });
            }
        }
    );
})();

(function repetitionChatGPT() {
    function log(logMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ key: logMessage }));
    }
    function codeSnippet() {
        log(" codeSnippet() function is called ");

        const codeElements = document.getElementsByTagName("pre");
        if (codeElements.length > 0) {
            for (let i = 0; i < codeElements.length; i++) {
                const codeElement = codeElements[i];
                let codeContent = codeElement.textContent;
                codeContent = codeContent.replace(/htmlCopy code/, "");
                const encodedContent = encodeURIComponent(codeContent);
                const encodedURL =
                    "https://repetition-html.vercel.app/#data=" + encodedContent;
                const iframe = document.createElement("iframe");
                iframe.src = encodedURL;
                iframe.style.width = "80vw";
                iframe.style.height = "100vh";
                const writeCodeButton = document.createElement("button");
                writeCodeButton.textContent = "Write Code";
                writeCodeButton.style.backgroundColor = "#3333ff";
                writeCodeButton.style.color = "white";
                writeCodeButton.style.paddingLeft = "15px";
                writeCodeButton.style.paddingRight = "15px";
                writeCodeButton.style.paddingTop = "5px";
                writeCodeButton.style.paddingBottom = "5px";
                writeCodeButton.style.marginBottom = "10px";
                writeCodeButton.style.borderRadius = "5px";

                const runButton = codeElement.nextElementSibling;

                if (runButton && runButton.tagName === "DIV") {
                    codeElement.parentNode.insertBefore(iframe, runButton);
                    codeElement.parentNode.insertBefore(
                        writeCodeButton,
                        runButton.nextSibling
                    );
                    codeElement.parentNode.removeChild(runButton);
                } else {
                    codeElement.parentNode.insertBefore(iframe, runButton.nextSibling);
                    codeElement.parentNode.insertBefore(
                        writeCodeButton,
                        runButton.nextSibling
                    );
                }
                codeElement.parentNode.removeChild(codeElement);

                writeCodeButton.addEventListener("click", () => {
                    window.ReactNativeWebView.postMessage(
                        JSON.stringify({ key: "writeCodeButtonClicked" })
                    );
                });
            }
        } else {
            console.log("No code elements found.");
        }
    }

    function captureEnteredCode() {
        const enteredCode = document.querySelector("form textarea").value;
    }

    setInterval(function () {
        // codeSnippet();
    }, 5000);

})([
    {
        label: "Layout",
        button: "Teach me Webpage structure in details with code examples "
    },
    {
        label: "HTML",
        button: "Teach me HTML programming language from scratch with code exmaples"
    },
    {
        label: "React Js ",
        button: "Teach me React Js  programming language from scratch with code exmaples"
    }
]);

`;








