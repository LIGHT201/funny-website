document.addEventListener("DOMContentLoaded", () => {
    // Select all links that should trigger the transition 
    const links = document.querySelectorAll("a, .transition-link");

    links.forEach(link => {
        link.addEventListener("click", function(event) {
            // Check if it's an internal link (ignores external links or anchor jumps)
            if (this.hostname === window.location.hostname) {
                event.preventDefault(); // Stop the browser from instantly changing pages
                let targetUrl = this.href;

                // Fade out the body
                document.body.classList.add("fade-out");

                // Wait for the CSS transition to finish (0.4s matches the CSS), then navigate
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 900);
            }
        });
    });
});