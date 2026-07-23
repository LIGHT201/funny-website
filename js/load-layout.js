document.addEventListener("DOMContentLoaded", async () => {
    try {
        let response = await fetch('components.html');
        let text = await response.text();
        let doc = new DOMParser().parseFromString(text, 'text/html');

        // Grab templates safely
        let header = doc.getElementById('header-content');
        let pages = doc.getElementById('sidebar-pages-content');
        let side = doc.getElementById('sidebar-side-content');

        // Replace containers in a tight, synchronous batch
        if (header) document.getElementById('header-container').replaceWith(header.content.cloneNode(true));
        if (pages) document.getElementById('sidebar-pages-container').replaceWith(pages.content.cloneNode(true));
        if (side) document.getElementById('sidebar-side-container').replaceWith(side.content.cloneNode(true));
        
    } catch (error) {
        console.error('Failed to load layout components:', error);
    }
});