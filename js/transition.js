document.addEventListener("DOMContentLoaded", async () => {
    try {
        let response = await fetch('components.html');
        let text = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/html');

        // Inject Header
        let headerTemplate = doc.getElementById('header-content');
        if (headerTemplate) {
            document.getElementById('header-container').replaceWith(headerTemplate.content.cloneNode(true));
        }

        // Inject Left Sidebar
        let pagesTemplate = doc.getElementById('sidebar-pages-content');
        if (pagesTemplate) {
            document.getElementById('sidebar-pages-container').replaceWith(pagesTemplate.content.cloneNode(true));
        }

        // Inject Right Sidebar
        let sideTemplate = doc.getElementById('sidebar-side-content');
        if (sideTemplate) {
            document.getElementById('sidebar-side-container').replaceWith(sideTemplate.content.cloneNode(true));
        }
    } catch (error) {
        console.error('Failed to load layout components:', error);
    }
});