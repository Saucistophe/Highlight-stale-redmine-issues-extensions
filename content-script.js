let columns = []

function scanAll() {
    if (!columns.length) return;
    const selector = columns.map(id => `td[data-id="${id}"] .issue-card`).join(', ');
    console.debug('Selector:', selector);

    document.querySelectorAll(selector).forEach(cell => {
        const attributesLines = cell.querySelectorAll('p.attributes');
        attributesLines.forEach(l => {
            let text = l.textContent;

            if (!text.includes("Dans le statut:") && !text.includes("In status:")) return;
            

            text = text.replace(/(\r\n|\n|\r)/gm, "");
            text = text.replace(/ +(?= )/g, '');
            text = text.trim();
            text = text.replace("Dans le statut: ", "");
            text = text.replace("In status: ", "");

            let time = 0;

            // French
            let result = /([0-9]+)\s+heures/.exec(text);
            if (result) time = result[1];

            result = /une\s+heure/.exec(text);
            if (result) time = 1;

            result = /([0-9]+)\s+jours/.exec(text);
            if (result) time = result[1] * 24;

            result = /un\s+jour/.exec(text);
            if (result) time = 24;

            // English
            result = /([0-9]+)\s+hours/.exec(text);
            if (result) time = result[1];

            result = /1\s+hour/.exec(text);
            if (result) time = 1;

            result = /([0-9]+)\s+days/.exec(text);
            if (result) time = result[1] * 24;

            result = /1\s+day/.exec(text);
            if (result) time = 24;

            console.debug(text, ' => ', time);

            const severity = Math.min(1, Math.max(0, time - 24) / (7 * 24));

            cell.style.backgroundColor = `hsl(${110 * (1 - severity)}, 66%,  ${90 - severity * 15}%)`;

        });
    });
}

chrome.storage.sync.get({ columns: [] }, (data) => {
    columns = data.columns;
    scanAll();
});

const observer = new MutationObserver(() => {
    clearTimeout(window.__redmine_scan_timer);
    window.__redmine_scan_timer = setTimeout(scanAll, 300);
});

observer.observe(document.body, { childList: true, subtree: true });
scanAll();

setInterval(scanAll, 60 * 1000);
