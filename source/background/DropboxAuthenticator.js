import Dropbox from "dropbox";
import { clearToken, getToken} from "./oauthToken";

class DropboxAuthenticator {

    constructor(accessToken) {
        this._token = accessToken || null;
        this._client = (accessToken) ?
            new Dropbox({ accessToken }) :
            new Dropbox({
                clientId: "5fstmwjaisrt06t"
            });
    }

    get client() {
        return this._client;
    }

    get token() {
        return this._token;
    }

    authenticate() {
        clearToken();
        this._token = null;
        let callbackURL = "https://buttercup.pw/",
            dropboxURL = this.client.getAuthenticationUrl(callbackURL);
        chrome.tabs.create({ url: dropboxURL });
        return new Promise(resolve => {
            let interval = setInterval(() => {
                const token = getToken();
                if (token) {
                    clearInterval(interval);
                    this._token = token;
                    resolve();
                }
            }, 100);
        });
    }

}

export default DropboxAuthenticator;
