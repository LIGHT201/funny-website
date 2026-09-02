document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch and parse the layout components file
        let response = await fetch('components.html');
        let htmlText = await response.text();
        
        let parser = new DOMParser();
        let doc = parser.parseFromString(htmlText, 'text/html');

     // Load Header
        let headerContent = doc.getElementById('header-content');
        if (headerContent) {
            document.getElementById('header-container').replaceWith(headerContent.content.cloneNode(true));
        }

        // Load sidebar page navs
        let sidebarPagesContent = doc.getElementById('sidebar-pages-content');
        if (sidebarPagesContent) {
            document.getElementById('sidebar-pages-container').replaceWith(sidebarPagesContent.content.cloneNode(true));
        }

        // Load sidebar side
        let sidebarSideContent = doc.getElementById('sidebar-side-content');
        if (sidebarSideContent) {
            document.getElementById('sidebar-side-container').replaceWith(sidebarSideContent.content.cloneNode(true));
        }

    } catch (error) {
        console.error('Failed to load layout components PANIC!!', error);
    }
});