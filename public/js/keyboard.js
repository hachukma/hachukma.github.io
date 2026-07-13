// Keyboard functionality - Fixed for phone keyboard with independent tone key
// DESKTOP: only the 'p' key has multi-tap. Double-tap removes the inserted 'p'
// and applies the high tone to the character before it.
function initializeKeyboard() {
    const keyboard = document.querySelector('.keyboard');
    const smallDeviceKeyboard = document.querySelector('.smalldevice-keyboard');
    let shiftPressed = false;
    let backspaceInterval = null;
    const backspaceDelay = 500; // ms
    const backspaceSpeed = 100; // ms

    // Multi-tap state – only used to detect double-tap on 'p'
    let lastTapTime = 0;
    let lastTapKey = null;
    const multiTapTimeout = 500; // ms

    // Function to apply high tone diacritic to the last character (used by phone and now by desktop P double-tap)
    function applyHighToneToLastChar() {
        const textDisplay = document.getElementById('textDisplay');
        const charContainers = Array.from(textDisplay.querySelectorAll('.char-container:not(.cursor-container)'));
        
        if (charContainers.length === 0) return;
        
        const lastContainer = charContainers[charContainers.length - 1];
        const syllabicLine = lastContainer.querySelector('.syllabic-line');
        
        if (syllabicLine.querySelector('.high-tone')) {
            return; // already has tone
        }
        
        let baseChar = syllabicLine.innerHTML;
        baseChar = baseChar.replace(/<span class="high-tone">.*?<\/span>/, '');
        
        syllabicLine.innerHTML = `${baseChar}<span class="high-tone">\uE024</span>`;
        
        const latinLine = lastContainer.querySelector('.alphabetic-line');
        const currentLatin = latinLine.textContent;
        if (!currentLatin.includes('́')) {
            latinLine.textContent = currentLatin + '́';
        }
        
        lastContainer.classList.add('active');
        setTimeout(() => lastContainer.classList.remove('active'), 100);
    }

    // --- Desktop keyboard ---
    if (keyboard) {
        keyboard.querySelectorAll('.key').forEach(key => {
            // Backspace with hold-to-delete
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

                    // --- SPECIAL HANDLING FOR DESKTOP 'p' KEY ---
                    if (keyChar === 'p') {
                        const currentTime = Date.now();
                        // Check for double-tap (same key, within timeout)
                        if (lastTapKey === 'p' && (currentTime - lastTapTime) < multiTapTimeout) {
                            // Double-tap detected:
                            // 1. Remove the 'p' that was just inserted on the first tap
                            updateDisplay('Backspace');
                            // 2. Apply high tone to the character that was before that 'p'
                            applyHighToneToLastChar();
                            // 3. Reset multi-tap state to prevent triple-tap side effects
                            lastTapKey = null;
                            // Visual feedback
                            key.classList.add('active');
                            setTimeout(() => key.classList.remove('active'), 100);
                            return; // done, nothing else to insert
                        } else {
                            // First tap: store state and insert 'p'
                            lastTapKey = 'p';
                            lastTapTime = currentTime;
                            charToDisplay = '\uE019'; // base P character
                            isReplace = false;        // append
                            // fall through to insertion
                        }
                    } else {
                        // All other keys: reset multi-tap state and insert directly
                        lastTapKey = null;
                        // charToDisplay stays as keyChar
                    }

                    // Insert the character (or space / shifted special)
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

    // --- Phone (small device) keyboard – UNCHANGED, no multi-tap ---
    if (smallDeviceKeyboard) {
        // Backspace hold
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

        smallDeviceKeyboard.querySelectorAll('.smalldevice-key, .smalldevice-keys, .smalldevice-key-arrow, .smalldevice-key-cut')
        .forEach(key => {
            key.addEventListener('click', (e) => {
                let keyChar = key.getAttribute('data-char') || key.getAttribute('data-key');
                
                // Dedicated tone key (phone) – stays exactly as before
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

                if (keyChar === 'Shift') {
                    shiftPressed = !shiftPressed;
                    toggleShiftState(shiftPressed);
                    return;
                }

                if (keyChar === 'X') {
                    updateDisplay('Backspace');
                    key.classList.add('active');
                    setTimeout(() => key.classList.remove('active'), 100);
                    return;
                }
                
                const ignoreKeys = ['Ctrl','Alt','Win','Fn','search','!#1','Enter','↵','←','→','ArrowLeft','ArrowRight'];
                if (!ignoreKeys.includes(keyChar)) {
                    let charToDisplay = keyChar;
                    let isReplace = false;

                    // Phone: direct insertion only, no multi-tap
                    if (charToDisplay.toLowerCase() === 'space' || charToDisplay === ' ' || charToDisplay === 'Spacebar') {
                        updateDisplay(' ');
                    } else if (shiftPressed && isSpecialKey(charToDisplay)) {
                        updateDisplay(getShiftedSpecialChar(charToDisplay), isReplace);
                    } else {
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

// Update display – unchanged, works with combined strings and tone spans
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

    if (text === 'Backspace') {
        if (cursorPosition >= 0) {
            textDisplay.removeChild(charContainers[cursorPosition]);
        } else if (charContainers.length > 0) {
            textDisplay.removeChild(charContainers[charContainers.length - 1]);
        }
    }
    else if (text === ' ') {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'char-container';
        spaceSpan.innerHTML = '&nbsp;';
        textDisplay.appendChild(spaceSpan);
    }
    else {
        const charContainer = document.createElement('span');
        charContainer.className = 'char-container';

        const scriptChar = document.createElement('div');
        scriptChar.className = 'syllabic-line';

        const latinChar = document.createElement('div');
        latinChar.className = 'alphabetic-line';

        const puaToLatin = {
            '\uE00A': 'a', '\uE00B': 'b', '\uE00C': 'ch', '\uE00D': 'd',
            '\uE00E': 'e', '\uE00F': 'ph', '\uE010': 'g', '\uE011': 'h',
            '\uE012': 'i', '\uE013': 'j', '\uE014': 'k', '\uE015': 'l',
            '\uE016': 'm', '\uE017': 'n', '\uE018': 'o', '\uE019': 'p',
            '\uE01A': 'th', '\uE01B': 'r', '\uE01C': 's', '\uE01D': 't',
            '\uE01E': 'u', '\uE01F': 'kh', '\uE020': 'w', '\uE021': 'ng',
            '\uE022': 'y', '\uE023': 'ɘ', '\uE024': ''
        };

        if (text.includes('\uE024')) {
            const baseChar = text.replace('\uE024', '');
            scriptChar.innerHTML = `${baseChar}<span class="high-tone">\uE024</span>`;
            scriptChar.setAttribute('data-key', puaToLatin[baseChar] || baseChar);
            latinChar.textContent = (puaToLatin[baseChar] || baseChar) + '́';
        } else {
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

// Helper functions (unchanged)
function isSpecialKey(key) { return false; }
function getShiftedSpecialChar(key) { return key; }

export { initializeKeyboard };