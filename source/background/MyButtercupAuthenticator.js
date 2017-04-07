import OAuth2Client from "client-oauth2";

import { clearToken, getToken} from "./oauthToken";

class MyButtercupAuthenticator {

    constructor() {
        this._token = null;
    }

    get token() {
        return this._token;
    }

    authenticate() {
        clearToken();
        this._token = null;
        const client = new OAuth2Client({
            clientId: "bcup_browser_ext",
            authorizationUri: "http://my.buttercup.dev/oauth/authorize",
            redirectUri: "https://buttercup.pw",
            scopes: []
        });
        chrome.tabs.create({ url: client.token.getUri() });
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

export default MyButtercupAuthenticator;
