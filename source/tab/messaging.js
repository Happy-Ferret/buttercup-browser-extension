import { enterLoginDetails, submitLoginForm } from "./login.js";
import { hideSearchDialog } from "./dialog.js";

function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case "close-dialog": {
            hideSearchDialog();
            return false;
        }
        case "enter-details": {
            const { signIn, entry } = request;
            enterLoginDetails(entry.properties.username, entry.properties.password, signIn);
            return false;
        }
        default:
            throw new Error(`Unknown message received: ${request.type}`);
    }
}

export function startMessageListener() {
    chrome.runtime.onMessage.addListener(handleMessage);
}
