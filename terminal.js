document.addEventListener('DOMContentLoaded', () => {
    const terminalContainer = document.getElementById('terminal-container');
    const terminalHeader = document.getElementById('terminal-header');
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    const terminalToggle = document.getElementById('terminal-toggle');
    const closeTerminalBtn = document.getElementById('close-terminal-btn');
    const tooltip = document.getElementById('tooltip');

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let initialViewportHeight = window.innerHeight;

    if (isTouchDevice) {
        tooltip.textContent = 'Tap to Open Terminal!';
    } else {
        tooltip.innerHTML = 'Try the Terminal! (Ctrl+K)';
    }
  
    const adjustTerminalForKeyboard = () => {
        if (!isTouchDevice) return;

        const currentHeight = window.innerHeight;
        if (currentHeight < initialViewportHeight * 0.75) {
            terminalContainer.style.top = '1rem'; 
            terminalContainer.style.height = `calc(100% - 2rem)`; 
            terminalContainer.style.transform = 'translateX(-50%)'; 
        } else {
            terminalContainer.style.top = '50%';
            terminalContainer.style.height = ''; 
            terminalContainer.style.transform = 'translate(-50%, -50%)';
            initialViewportHeight = currentHeight;
        }
    };

    window.addEventListener('resize', adjustTerminalForKeyboard);

    const commands = {
        'help': 'Available commands: <br> `help` - Show this list <br> `ls` - List available sections <br> `cd` - Open a section ( `cd about`) <br> `socials` - Display social media links <br> `neofetch` - Display system info <br> `clear` - Clear the terminal <br> `exit` - Close the terminal',
        'ls': 'about &nbsp; projects &nbsp; skills &nbsp; blog &nbsp; contact',
        'socials': 'Find me on: <br> - <a href="mailto:davidgathonson@gmail.com" target="_blank" class="text-sky-400 hover:underline">Email</a> <br> - <a href="https://github.com/dave-019" target="_blank" class="text-sky-400 hover:underline">GitHub</a> <br> - <a href="https://www.linkedin.com/in/mwangi-david-6b279a2b4/" target="_blank" class="text-sky-400 hover:underline">LinkedIn</a> <br> - <a href="https://x.com/rectifier00x" target="_blank" class="text-sky-400 hover:underline">X (Twitter)</a>',
        'neofetch': `<pre class="text-cyan-400">
            <span class="text-green-400">Username</span>: recitifier00x@portfolio</span>
            <span class="text-green-400">OS</span>: Web Browser
            <span class="text-green-400">Host</span>: ubuntu 22.04 :)
            <span class="text-green-400">Shell</span>: portfolio.js
            <span class="text-green-400">Theme</span>: MinimalTech
</pre>`,
    };

    const openTerminal = () => {
        terminalContainer.classList.remove('hidden');
        terminalInput.focus();
        tooltip.style.display = 'none'; 
    };

    const closeTerminal = () => {
        terminalContainer.classList.add('hidden');
        if (isTouchDevice) {
            terminalContainer.style.top = '50%';
            terminalContainer.style.height = ''; 
            terminalContainer.style.transform = 'translate(-50%, -50%)';
        }
    };

    const printToTerminal = (text, isCommand = false) => {
        const line = document.createElement('div');
        if (isCommand) {
            line.innerHTML = `<span class="text-cyan-400 select-none">$</span> <span class="text-white">${text}</span>`;
        } else {
            line.innerHTML = text;
        }
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const processCommand = (cmd) => {
        printToTerminal(cmd, true);
        const [command, ...args] = cmd.toLowerCase().split(' ').filter(Boolean);
        const section = args[0];

        if (command === 'cd') {
            const nodeMap = {'about': 'about-me', 'projects': 'projects', 'skills': 'skills', 'blog': 'blog', 'contact': 'contact'};
            const nodeId = nodeMap[section];
            const nodeToOpen = typeof nodes !== 'undefined' && nodes.find(n => n.c === nodeId);
            if (nodeToOpen) {
                printToTerminal(`Opening '${section}'...`);
                if (typeof openModal !== 'undefined') openModal(nodeToOpen);
                if (typeof activeIdx !== 'undefined') activeIdx = nodes.findIndex(n => n.c === nodeId);
            } else {
                printToTerminal(`Error: Section '${section}' not found. Try 'ls' to see available sections.`);
            }
        } else if (commands[command]) {
            printToTerminal(commands[command]);
        } else if (command === 'clear') {
            terminalBody.innerHTML = '';
        } else if (command === 'exit') {
            closeTerminal();
        } else if (command) {
            printToTerminal(`Command not found: ${command}. Type 'help' for a list of commands.`);
        }
    };

    let isDraggingTerminal = false;
    let offsetX, offsetY;

    const onMouseDown = (e) => {
        if (e.target.id === 'close-terminal-btn') {
            return;
        }
        isDraggingTerminal = true;
        offsetX = e.clientX - terminalContainer.getBoundingClientRect().left;
        offsetY = e.clientY - terminalContainer.getBoundingClientRect().top;
        terminalContainer.style.transform = 'none';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
    
    const onMouseMove = (e) => {
        if (!isDraggingTerminal) return;
        terminalContainer.style.left = `${e.clientX - offsetX}px`;
        terminalContainer.style.top = `${e.clientY - offsetY}px`;
    };

    const onMouseUp = () => {
        isDraggingTerminal = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    terminalHeader.addEventListener('mousedown', onMouseDown);
    
    const handleToggleClick = (e) => {
        e.preventDefault();
        openTerminal();
    };
    terminalToggle.addEventListener('click', handleToggleClick);
    terminalToggle.addEventListener('touchend', handleToggleClick);
    
    const handleCloseClick = (e) => {
        e.preventDefault();
        closeTerminal();
    };
    closeTerminalBtn.addEventListener('click', handleCloseClick);
    closeTerminalBtn.addEventListener('touchend', handleCloseClick);


    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            processCommand(terminalInput.value);
            terminalInput.value = '';
        }
    });

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            terminalContainer.classList.contains('hidden') ? openTerminal() : closeTerminal();
        }
    });
     if (isTouchDevice) {
        terminalInput.addEventListener('focus', () => {
            
            terminalContainer.classList.add('terminal-keyboard-active');
        });

        terminalInput.addEventListener('blur', () => {
            
            terminalContainer.classList.remove('terminal-keyboard-active');
        });
    }
    

    printToTerminal("Welcome !");
    printToTerminal("Type `help` to get started.");
});
