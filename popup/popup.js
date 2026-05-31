document.addEventListener('DOMContentLoaded', function() {
    const statusText = document.getElementById('statusText');
    const modeSelect = document.getElementById('modeSelect');
    const delayInput = document.getElementById('delayInput');
    const noiseCheck = document.getElementById('noiseCheck');

    chrome.storage.local.get(['evalMode', 'isActive', 'baseDelay', 'humanNoise'], function(data) {
        if (data.evalMode) modeSelect.value = data.evalMode;
        if (data.baseDelay) delayInput.value = data.baseDelay;
        if (data.humanNoise !== undefined) noiseCheck.checked = data.humanNoise;
        updateStatus(data.isActive);
    });

    function updateStatus(isActive) {
        if (isActive) {
            statusText.innerText = 'Status: Active';
            statusText.className = 'status running';
        } else {
            statusText.innerText = 'Status: Idle';
            statusText.className = 'status stopped';
        }
    }

    document.getElementById('btnStart').addEventListener('click', () => {
        const config = {
            evalMode: modeSelect.value,
            baseDelay: parseFloat(delayInput.value) || 1.5,
            humanNoise: noiseCheck.checked,
            isActive: true
        };

        chrome.storage.local.set(config, function() {
            updateStatus(true);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if(tabs[0] && tabs[0].url.includes("app2.bau.edu.jo:7799/eval/")) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        });
    });

    document.getElementById('btnStop').addEventListener('click', () => {
        chrome.storage.local.set({ isActive: false }, function() {
            updateStatus(false);
        });
    });
});