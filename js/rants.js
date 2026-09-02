
async function loadRant(id) {
    const rantBox = document.getElementById('rants-display-box');

    try {

        const response = await fetch('js/rants.json');
        if (!response.ok) {
            throw new Error('Failed to load rants.json');
        }

        const rantsData = await response.json();
        const rant = rantsData[id];

        if (rant) {
            renderRantHTML(rantBox, rant);
        } else {
            rantBox.innerHTML = `<h2>Error</h2><p>Rant not found!</p>`;
        }
    } catch (error) {
        console.error('Error fetching rants:', error);
        rantBox.innerHTML = `<h2>Error</h2><p>Could not load rants data.</p>`;
    }
}

// parser for tags (this still sucks trying to use..)
function parseRantText(rawText) {
    let lines = rawText.split('\n');
    let parsedLines = lines.map(line => {
        let trimmed = line.trim();


        if (trimmed.startsWith('\\right')) {
            let content = trimmed.replace('\\right', '').trim();
            return `<div style="text-align: right; width: 100%; margin: 5px 0;">${content}</div>`;
        }

        if (trimmed.startsWith('\\left')) {
            let content = trimmed.replace('\\left', '').trim();
            return `<div style="text-align: left; width: 100%; margin: 5px 0;">${content}</div>`;
        }
        // right and left parser for setting text to one side.
        // //left is utterly useless btw

        if (trimmed.startsWith('\\redact')) {
            let content = trimmed.replace('\\redact', '').trim();
            return `<span style="background-color: black; color: black; cursor: pointer;">${content}</span>`;
        }

        if (trimmed === '') {
            return `<br>`;
        }




        if (trimmed.startsWith('<')) {
            return line;
        }


        return `<div>${line}</div>`;
    });

    return parsedLines.join('\n');
}


function renderRantHTML(container, rant) {
    const formattedContent = parseRantText(rant.content);

    container.innerHTML = `
        <h2>${rant.title}</h2>
        <small style="opacity: 0.7;">posted: ${rant.date}</small>
        <hr style="border: 1px solid var(--border_col); margin: 10px 0;">
        <div style="text-align: left; padding: 10px; overflow-wrap: break-word;">
            ${formattedContent}
        </div>
    `;
}
