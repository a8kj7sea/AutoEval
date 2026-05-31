function executeEval() {
    chrome.storage.local.get(['evalMode', 'isActive', 'baseDelay', 'humanNoise'], function(data) {
        if (!data.isActive) return;

        const nextButton = document.getElementById('btnNext');
        const captchaInput = document.getElementById('captcha');

        if (captchaInput) {
            const captchaWrapper = captchaInput.parentElement;
            const captchaText = captchaWrapper.innerText || "";
            const match = captchaText.match(/\d{4}/);
            
            if (match) {
                captchaInput.value = match[0];
                const submitButton = captchaWrapper.querySelector('input[type="SUBMIT"]');
                if (submitButton) {
                    submitButton.click();
                }
            }
            return;
        }

        if (nextButton) {
            function calculateDelay(baseSeconds, applyNoise) {
                let ms = baseSeconds * 1000;
                if (applyNoise) {
                    const variance = (Math.random() * 0.7) - 0.2;
                    ms = ms * (1 + variance);
                }
                return Math.max(500, Math.floor(ms));
            }

            const readingDelay = calculateDelay(data.baseDelay, data.humanNoise);

            setTimeout(() => {
                let targetValue = "5";
                if (data.evalMode === 'Bad') {
                    targetValue = "1";
                } else if (data.evalMode === 'Random') {
                    targetValue = (Math.floor(Math.random() * 5) + 1).toString();
                }

                const radioToSelect = document.querySelector(`input[name="evalans"][value="${targetValue}"]`);
                if (radioToSelect) {
                    radioToSelect.checked = true;
                    radioToSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }

                const actionDelay = calculateDelay(data.baseDelay * 0.5, data.humanNoise);
                setTimeout(() => {
                    nextButton.click();
                }, actionDelay);
            }, readingDelay);

        } else {
            chrome.storage.local.set({ isActive: false });
        }
    });
}

if (document.readyState === 'complete') {
    executeEval();
} else {
    window.addEventListener('load', executeEval);
}