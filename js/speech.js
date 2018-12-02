let startB = document.getElementById('start_button');
startB.addEventListener("click", startButton);

let final_transcript = '';
let recognizing = false;
let ignore_onend;
let start_timestamp;
let recognition;

showInfo('info_start');

function magnify() {
    zoomLevel = (zoomLevel === 100) ? 150 : 100;

    chrome.tabs.executeScript({
        code: 'document.body.style.zoom = "' + zoomLevel + '%";'
    });
}


if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        console.log("recognition start");
        recognizing = true;

        showInfo('info_speak_now');
        start_img.src = 'mic-animate.gif';
    };

    recognition.onerror = function (event) {
        console.log("recognition error");
        if (event.error === 'no-speech') {
            start_img.src = 'mic.gif';
            showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error === 'audio-capture') {
            start_img.src = 'mic.gif';
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error === 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function () {
        console.log("recognition end");
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = 'mic.gif';
        if (!final_transcript) {
            showInfo('info_start');
            return;
        }
        showInfo('');
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            let range = document.createRange();
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);
        }
    };

    recognition.onresult = function (event) {
        console.log("recognition result");
        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);
        let tokens = final_transcript.split(" ");
        //var array = tokens.split(',');
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
        if (final_transcript || interim_transcript) {
            showButtons('inline-block');
        }

        console.log(tokens);
        chrome.tabs.query({active: true}, function (result) {
            chrome.tabs.executeScript(result[0].id, {
                code: `
                    
                    var flag = false;
                    var flagsearch = false;
                    var dispatchMouseEvent = function(target, var_args) {
                        var e = document.createEvent("MouseEvents");
                        // If you need clientX, clientY, etc., you can call
                        // initMouseEvent instead of initEvent
                      e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
                      target.dispatchEvent(e);
                    };
                    for (const a of document.querySelectorAll("a")) {
                        let tokens = '${tokens}';
                        if (tokens.indexOf(',') == -1) {
                            tokens = [tokens]
                        }
                        else {
                            tokens = tokens.split(',')
                        }
                        tokens.forEach(my_t => {
                            my_t = my_t.toLowerCase();
                            if(my_t.search("click") != -1){
                                console.log('click');
                                flag=true;
                            }
                            if(my_t.search("search") != -1){
                                console.log('search');
                                e = document.getElementById("twotabsearchtextbox")
                                for( var i = 0; i < tokens.length-1; i++){ 
                                   if ( tokens[i].toLowerCase() == 'search') {
                                     tokens.splice(i, 1); 
                                     break;
                                   }
                                }
                                e.value = tokens.join(' ');
                                document.querySelectorAll('input[type=submit]')[0].click();
                            }
                            if (a.textContent.toLowerCase().includes(my_t)){
                                console.log(a);
                                if(flag) dispatchMouseEvent(a, 'click', true, true);
                                console.log('enlarge');
                                var nodes = a.childNodes;
                                for(var i=0; i<nodes.length; i++) {
                                    if (nodes[i].nodeName.toLowerCase() == 'div') {
                                         nodes[i].style.fontSize = '30px';
                                         nodes[i].style.color = 'red';
                                    }
                                }
                                a.style.fontSize = '30px';
                                a.style.color = 'red';
                            }
                        });
                    }`
            });
        });
    };
}

function upgrade() {
    showInfo('info_upgrade');
}

let two_line = /\n\n/g;
let one_line = /\n/g;

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

let first_char = /\S/;

function capitalize(s) {
    return s.replace(first_char, function (m) {
        return m.toUpperCase();
    });
}

function startButton(event) {
    navigator.mediaDevices.getUserMedia({audio: true});
    console.log('start button');
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = 'mic-slash.gif';
    showInfo('info_allow');
    showButtons('none');
    start_timestamp = event.timeStamp;
}

function showInfo(s) {
    if (s) {
        for (let child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id === s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

let current_style;

function showButtons(style) {
    if (style === current_style) {
        return;
    }
    current_style = style;
}

