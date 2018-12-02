let startB = document.getElementById('start_button');
startB.addEventListener("click", startButton);

let final_transcript = '';
let recognizing = false;
let ignore_onend;
let start_timestamp;
let recognition;

let langs =
    [['Afrikaans', ['af-ZA']],
        ['Bahasa Indonesia', ['id-ID']],
        ['Bahasa Melayu', ['ms-MY']],
        ['Català', ['ca-ES']],
        ['Čeština', ['cs-CZ']],
        ['Deutsch', ['de-DE']],
        ['English', ['en-AU', 'Australia'],
            ['en-CA', 'Canada'],
            ['en-IN', 'India'],
            ['en-NZ', 'New Zealand'],
            ['en-ZA', 'South Africa'],
            ['en-GB', 'United Kingdom'],
            ['en-US', 'United States']],
        ['Español', ['es-AR', 'Argentina'],
            ['es-BO', 'Bolivia'],
            ['es-CL', 'Chile'],
            ['es-CO', 'Colombia'],
            ['es-CR', 'Costa Rica'],
            ['es-EC', 'Ecuador'],
            ['es-SV', 'El Salvador'],
            ['es-ES', 'España'],
            ['es-US', 'Estados Unidos'],
            ['es-GT', 'Guatemala'],
            ['es-HN', 'Honduras'],
            ['es-MX', 'México'],
            ['es-NI', 'Nicaragua'],
            ['es-PA', 'Panamá'],
            ['es-PY', 'Paraguay'],
            ['es-PE', 'Perú'],
            ['es-PR', 'Puerto Rico'],
            ['es-DO', 'República Dominicana'],
            ['es-UY', 'Uruguay'],
            ['es-VE', 'Venezuela']],
        ['Euskara', ['eu-ES']],
        ['Français', ['fr-FR']],
        ['Galego', ['gl-ES']],
        ['Hrvatski', ['hr_HR']],
        ['IsiZulu', ['zu-ZA']],
        ['Íslenska', ['is-IS']],
        ['Italiano', ['it-IT', 'Italia'],
            ['it-CH', 'Svizzera']],
        ['Magyar', ['hu-HU']],
        ['Nederlands', ['nl-NL']],
        ['Norsk bokmål', ['nb-NO']],
        ['Polski', ['pl-PL']],
        ['Português', ['pt-BR', 'Brasil'],
            ['pt-PT', 'Portugal']],
        ['Română', ['ro-RO']],
        ['Slovenčina', ['sk-SK']],
        ['Suomi', ['fi-FI']],
        ['Svenska', ['sv-SE']],
        ['Türkçe', ['tr-TR']],
        ['български', ['bg-BG']],
        ['Pусский', ['ru-RU']],
        ['Српски', ['sr-RS']],
        ['한국어', ['ko-KR']],
        ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
            ['cmn-Hans-HK', '普通话 (香港)'],
            ['cmn-Hant-TW', '中文 (台灣)'],
            ['yue-Hant-HK', '粵語 (香港)']],
        ['日本語', ['ja-JP']],
        ['Lingua latīna', ['la']]];

for (let i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
}

select_language.selectedIndex = 6;
updateCountry();

select_dialect.selectedIndex = 6;
showInfo('info_start');

function magnify() {
    zoomLevel = (zoomLevel === 100) ? 150 : 100;

    chrome.tabs.executeScript({
        code: 'document.body.style.zoom = "' + zoomLevel + '%";'
    });
}

function updateCountry() {
    for (let i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    let list = langs[select_language.selectedIndex];
    for (let i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length === 1 ? 'hidden' : 'visible';
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
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
        if (final_transcript || interim_transcript) {
            showButtons('inline-block');
        }

        chrome.tabs.query({active: true}, function (result) {
            chrome.tabs.executeScript(result[0].id, {
                code: `
                    var dispatchMouseEvent = function(target, var_args) {
                        var e = document.createEvent("MouseEvents");
                        // If you need clientX, clientY, etc., you can call
                        // initMouseEvent instead of initEvent
                      e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
                      target.dispatchEvent(e);
                    };
            
                    for (const a of document.querySelectorAll("a")) {
                        if (a.textContent.includes("${final_transcript}")) {
                            a.style.fontSize = '30px';
                            console.log(a);
                            dispatchMouseEvent(a, 'click', true, true);
                        }
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
    recognition.lang = select_dialect.value;
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
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
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

