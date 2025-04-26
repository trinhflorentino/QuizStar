function adjustFinishQuestionTextSize() {
    const container = document.querySelector('.relative.w-[78%].h-[30vh]');
    const questionElement = document.getElementById('FinishQuestion');
    
    if (!container || !questionElement) return;

    // Reset scale to measure original overflow
    questionElement.style.setProperty('--text-scale', '1');
    
    // Get the content height and container height
    const contentHeight = questionElement.scrollHeight;
    const containerHeight = container.clientHeight * 0.6; // Using 60% of container height as max
    
    if (contentHeight > containerHeight) {
        // Calculate and apply scale
        const scale = containerHeight / contentHeight;
        questionElement.style.setProperty('--text-scale', scale.toString());
    }
}

// Call this when loading questions or resizing window
window.addEventListener('resize', adjustFinishQuestionTextSize);

// Create a MutationObserver to detect when question content changes
const questionObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
            // Wait a small amount of time for the DOM to fully update
            setTimeout(adjustFinishQuestionTextSize, 50);
        }
    });
});

// Start observing the question element for content changes
document.addEventListener('DOMContentLoaded', function() {
    const questionElement = document.getElementById('FinishQuestion');
    if (questionElement) {
        questionObserver.observe(questionElement, { 
            childList: true, 
            characterData: true,
            subtree: true 
        });
        // Initial adjustment
        adjustFinishQuestionTextSize();
    }
});

// Also adjust text size when the Finish section becomes visible
document.addEventListener('DOMContentLoaded', function() {
    const finishSection = document.getElementById('Finish');
    if (finishSection) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!finishSection.classList.contains('hidden')) {
                        setTimeout(adjustFinishQuestionTextSize, 100);
                    }
                }
            });
        });
        observer.observe(finishSection, { attributes: true });
    }
});
