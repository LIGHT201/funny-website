document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch layout components template file
        let response = await fetch('components.html');
        let htmlText = await response.text();
        
        let parser = new DOMParser();
        let doc = parser.parseFromString(htmlText, 'text/html');

        const insertComponent = (templateId, containerId) => {
            let template = doc.getElementById(templateId);
            let container = document.getElementById(containerId);
            
            if (template && container) {
                // Clone the template content and replace the container
                container.replaceWith(template.content.cloneNode(true));
            } else {
                console.warn(`Template '${templateId}' or container '${containerId}' not found.`);
            }
        };

        // Load specific components into their respective containers
        insertComponent('header-content', 'header-container');
        insertComponent('sidebar-pages-content', 'sidebar-pages-container');
        insertComponent('sidebar-side-content', 'sidebar-side-container');

    } catch (error) {
        console.error('Failed to load layout components:', error);
    }
});