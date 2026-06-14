// Keyboard functionality - Fixed for phone keyboard with independent tone key
function initializeKeyboard() {
    const keyboard = document.querySelector('.keyboard');
    const smallDeviceKeyboard = document.querySelector('.smalldevice-keyboard');
    let shiftPressed = false;
    let backspaceInterval = null;
    const backspaceDelay = 500; // ms
    const backspaceSpeed = 100; // ms

    // Multi-tap state (only for desktop keyboard now, phone keys are independent)
    let lastTapTime = 0;
    let lastTapKey = null;
    let tapCount = 0;
    const multiTapTimeout = 500; // ms
    const multiTapMap = {
        'a': ['\uE00A', '\uE00A\uE024'],
        'b': ['\uE00B', '\uE00B\uE024'],
        'd': ['\uE00D', '\uE00D\uE024'],
        'e': ['\uE00E', '\uE00E\uE024'],
        'g': ['\uE010', '\uE010\uE024'],
        'h': ['\uE011', '\uE011\uE024'],
        'i': ['\uE012', '\uE012\uE024'],
        'j': ['\uE013', '\uE013\uE024'],
        'k': ['\uE014', '\uE014\uE024'],
        'l': ['\uE015', '\uE015\uE024'],
        'm': ['\uE016', '\uE016\uE024'],
        'n': ['\uE017', '\uE017\uE024'],
        'o': ['\uE018', '\uE018\uE024'],
        'p': ['\uE019', '\uE019\uE024'],
        'r': ['\uE01B', '\uE01B\uE024'],
        's': ['\uE01C', '\uE01C\uE024'],
        't': ['\uE01D', '\uE01D\uE024'],
        'u': ['\uE01E', '\uE01E\uE024'],
        'kh': ['\uE01F', '\uE01F\uE024'],
        'w': ['\uE020', '\uE020\uE024'],
        'y': ['\uE022', '\uE022\uE024'],
        'ɘ': ['\uE023', '\uE023\uE024']
    };

    // Function to apply high tone diacritic to the last character
    function applyHighToneToLastChar() {
        const textDisplay = document.getElementById('textDisplay');
        const charContainers = Array.from(textDisplay.querySelectorAll('.char-container:not(.cursor-container)'));
        
        if (charContainers.length === 0) return;
        
        const lastContainer = charContainers[charContainers.length - 1];
        const syllabicLine = lastContainer.querySelector('.syllabic-line');
        
        // Check if high tone already applied to this character
        if (syllabicLine.querySelector('.high-tone')) {
            return; // Already has high tone, do nothing
        }
        
        // Get the current base character
        let baseChar = syllabicLine.innerHTML;
        // Remove any existing diacritic spans to get clean base
        baseChar = baseChar.replace(/<span class="high-tone">.*?<\/span>/, '');
        
        // Apply high tone diacritic
        syllabicLine.innerHTML = `${baseChar}<span class="high-tone">\uE024</span>`;
        
        // Update the latin line accordingly (add tone marker)
        const latinLine = lastContainer.querySelector('.alphabetic-line');
        const currentLatin = latinLine.textContent;
        // Add a tone marker symbol (e.g., acute accent) to Latin representation
        if (!currentLatin.includes('́')) {
            latinLine.textContent = currentLatin + '́';
        }
        
        // Trigger visual feedback
        lastContainer.classList.add('active');
        setTimeout(() => lastContainer.classList.remove('active'), 100);
    }

    // Handle desktop keyboard keys (unchanged, fully functional)
    if (keyboard) {
        keyboard.querySelectorAll('.key').forEach(key => {
            if (key.getAttribute('data-key') === 'Backspace' || key.id === 'two-set-key') {
                key.addEventListener('mousedown', () => {
                    backspaceInterval = setTimeout(() => {
                        backspaceInterval = setInterval(() => {
                            updateDisplay('Backspace');
                        }, backspaceSpeed);
                    }, backspaceDelay);
                });
                ['mouseup', 'mouseleave'].forEach(evt => {
                    key.addEventListener(evt, () => {
                        clearTimeout(backspaceInterval);
                        clearInterval(backspaceInterval);
                    });
                });
            }

            key.addEventListener('click', () => {
                const keyChar = key.getAttribute('data-key') || key.getAttribute('data-char');

                if (keyChar === 'Shift') {
                    shiftPressed = !shiftPressed;
                    toggleShiftState(shiftPressed);
                    return;
                }

                if (!['Ctrl','Alt','Win','Fn','Enter','ArrowLeft','ArrowRight'].includes(keyChar)) {
                    let charToDisplay = keyChar;
                    let isReplace = false;

                    const currentTime = Date.now();
                    if (multiTapMap[keyChar]) {
                        if (lastTapKey === keyChar && (currentTime - lastTapTime) < multiTapTimeout) {
                            tapCount = (tapCount + 1) % multiTapMap[keyChar].length;
                            charToDisplay = multiTapMap[keyChar][tapCount];
                            isReplace = true;
                        } else {
                            tapCount = 0;
                            charToDisplay = multiTapMap[keyChar][0];
                        }
                        lastTapKey = keyChar;
                        lastTapTime = currentTime;
                    } else {
                        lastTapKey = null;
                        tapCount = 0;
                    }

                    if (charToDisplay.toLowerCase() === 'space' || charToDisplay === ' ' || charToDisplay === 'Spacebar') {
                        updateDisplay(' ');
                    } else if (shiftPressed && isSpecialKey(charToDisplay)) {
                        updateDisplay(getShiftedSpecialChar(charToDisplay), isReplace);
                    } else {
                        updateDisplay(charToDisplay, isReplace);
                    }

                    key.classList.add('active');
                    setTimeout(() => key.classList.remove('active'), 100);
                }
            });
        });
    }

    // Handle phone (small device) keyboard - FIXED with independent tone key
    if (smallDeviceKeyboard) {
        // Backspace with hold-to-delete
        smallDeviceKeyboard.querySelectorAll('.smalldevice-key-cut').forEach(key => {
            key.addEventListener('mousedown', () => {
                backspaceInterval = setTimeout(() => {
                    backspaceInterval = setInterval(() => {
                        updateDisplay('Backspace');
                    }, backspaceSpeed);
                }, backspaceDelay);
            });
            ['mouseup','mouseleave'].forEach(evt => {
                key.addEventListener(evt, () => {
                    clearTimeout(backspaceInterval);
                    clearInterval(backspaceInterval);
                });
            });
        });

        // All small device keys
        smallDeviceKeyboard.querySelectorAll('.smalldevice-key, .smalldevice-keys, .smalldevice-key-arrow, .smalldevice-key-cut')
        .forEach(key => {
            key.addEventListener('click', (e) => {
                // Get the character code - data-char contains the actual Unicode PUA character
                let keyChar = key.getAttribute('data-char') || key.getAttribute('data-key');
                
                // SPECIAL HANDLING FOR INDEPENDENT TONE KEY
                // Check if this is the tone key (U+E024 high tone diacritic)
                const isToneKey = (keyChar === '\uE024' || keyChar === '&#xE024;' || 
                                   key.classList.contains('tone-key') || 
                                   (key.getAttribute('data-type') === 'tone'));
                
                if (isToneKey) {
                    e.stopPropagation();
                    applyHighToneToLastChar();
                    key.classList.add('active');
                    setTimeout(() => key.classList.remove('active'), 100);
                    return;
                }

                // Handle Shift key for phone
                if (keyChar === 'Shift') {
                    shiftPressed = !shiftPressed;
                    toggleShiftState(shiftPressed);
                    return;
                }

                // Handle Backspace (X key)
                if (keyChar === 'X') {
                    updateDisplay('Backspace');
                    key.classList.add('active');
                    setTimeout(() => key.classList.remove('active'), 100);
                    return;
                }
                
                // Handle special function keys that should not insert text
                const ignoreKeys = ['Ctrl','Alt','Win','Fn','search','!#1','Enter','↵','←','→','ArrowLeft','ArrowRight'];
                if (!ignoreKeys.includes(keyChar)) {
                    let charToDisplay = keyChar;
                    let isReplace = false;

                    // Phone keyboard uses direct character insertion (no multi-tap for consonants)
                    // Only use multi-tap for specific keys if needed, but tone is separate now
                    // For simplicity, phone just inserts the character directly without multi-tap logic
                    // (Multi-tap was causing issues with independent tone key)
                    
                    if (charToDisplay.toLowerCase() === 'space' || charToDisplay === ' ' || charToDisplay === 'Spacebar') {
                        updateDisplay(' ');
                    } else if (shiftPressed && isSpecialKey(charToDisplay)) {
                        updateDisplay(getShiftedSpecialChar(charToDisplay), isReplace);
                    } else {
                        // Direct character insertion
                        updateDisplay(charToDisplay, isReplace);
                    }
                }

                key.classList.add('active');
                setTimeout(() => key.classList.remove('active'), 100);
            });
        });
    }

    function toggleShiftState(active) {
        if (keyboard) {
            keyboard.querySelectorAll('.key[data-key="Shift"]').forEach(key => {
                if (active) key.classList.add('active');
                else key.classList.remove('active');
            });
        }
        if (smallDeviceKeyboard) {
            smallDeviceKeyboard.querySelectorAll('.smalldevice-key[data-key="Shift"]').forEach(key => {
                if (active) key.classList.add('active');
                else key.classList.remove('active');
            });
        }
    }
}

// Update display - modified to properly handle high tone diacritic integration
function updateDisplay(text, replace = false) {
    const textDisplay = document.getElementById('textDisplay');
    const cursor = textDisplay.querySelector('.cursor');
    let cursorPosition = -1;
    let charContainers = Array.from(textDisplay.querySelectorAll('.char-container'));

    if (cursor) {
        cursorPosition = charContainers.indexOf(cursor.previousElementSibling);
        cursor.remove();
    }

    if (replace && charContainers.length > 0) {
        const indexToRemove = cursorPosition >= 0 ? cursorPosition : charContainers.length - 1;
        if (indexToRemove >= 0) {
            textDisplay.removeChild(charContainers[indexToRemove]);
            charContainers = Array.from(textDisplay.querySelectorAll('.char-container'));
            if (cursorPosition >= 0) cursorPosition--;
        }
    }

    // Backspace
    if (text === 'Backspace') {
        if (cursorPosition >= 0) {
            textDisplay.removeChild(charContainers[cursorPosition]);
        } else if (charContainers.length > 0) {
            textDisplay.removeChild(charContainers[charContainers.length - 1]);
        }
    }
    // Space
    else if (text === ' ') {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'char-container';
        spaceSpan.innerHTML = '&nbsp;';
        textDisplay.appendChild(spaceSpan);
    }
    // Normal character (including possible combined tone)
    else {
        const charContainer = document.createElement('span');
        charContainer.className = 'char-container';

        const scriptChar = document.createElement('div');
        scriptChar.className = 'syllabic-line';

        const latinChar = document.createElement('div');
        latinChar.className = 'alphabetic-line';

        // Mapping for PUA to Latin names
        const puaToLatin = {
            '\uE00A': 'a',
            '\uE00B': 'b',
            '\uE00C': 'ch',
            '\uE00D': 'd',
            '\uE00E': 'e',
            '\uE00F': 'ph',
            '\uE010': 'g',
            '\uE011': 'h',
            '\uE012': 'i',
            '\uE013': 'j',
            '\uE014': 'k',
            '\uE015': 'l',
            '\uE016': 'm',
            '\uE017': 'n',
            '\uE018': 'o',
            '\uE019': 'p',
            '\uE01A': 'th',
            '\uE01B': 'r',
            '\uE01C': 's',
            '\uE01D': 't',
            '\uE01E': 'u',
            '\uE01F': 'kh',
            '\uE020': 'w',
            '\uE021': 'ng',
            '\uE022': 'y',
            '\uE023': 'ɘ',
            '\uE024': '' // tone diacritic, handled separately
        };

        // Special handling for high tone diacritic \uE024 embedded in text
        if (text.includes('\uE024')) {
            const baseChar = text.replace('\uE024', '');
            scriptChar.innerHTML = `${baseChar}<span class="high-tone">\uE024</span>`;
            scriptChar.setAttribute('data-key', puaToLatin[baseChar] || baseChar);
            latinChar.textContent = (puaToLatin[baseChar] || baseChar) + '́';
        } else {
            // Try to find the key element for mapping
            const keyElement = 
                document.querySelector(`.key[data-char="${text}"], .smalldevice-key[data-char="${text}"], .smalldevice-keys[data-char="${text}"]`) ||
                document.querySelector(`.key[data-key="${text}"], .smalldevice-key[data-key="${text}"], .smalldevice-keys[data-key="${text}"]`);

            if (keyElement) {
                const charEntity = keyElement.getAttribute('data-char') || text;
                scriptChar.innerHTML = charEntity;
                const k = keyElement.getAttribute('data-key') || text;
                scriptChar.setAttribute('data-key', k);
                latinChar.textContent = k;
            } else {
                scriptChar.textContent = text;
                scriptChar.setAttribute('data-key', puaToLatin[text] || text);
                latinChar.textContent = puaToLatin[text] || text;
            }
        }

        charContainer.appendChild(scriptChar);
        charContainer.appendChild(latinChar);
        textDisplay.appendChild(charContainer);
    }

    const newCursor = document.createElement('span');
    newCursor.className = 'cursor';
    textDisplay.appendChild(newCursor);
}

// Helper functions
function isSpecialKey(key) {
    return false;
}

function getShiftedSpecialChar(key) {
    return key;
}

export { initializeKeyboard };