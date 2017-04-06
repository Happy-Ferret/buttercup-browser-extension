import OAuth2Client from "client-oauth2";

class MyButtercupAuthenticator {

    constructor() {
        this._token = null;
    }

    get token() {
        return this._token;
    }

    authenticate() {
        const client = new OAuth2Client({
            clientId: "bcup_browser_ext",
            // clientSecret: '123',
            // accessTokenUri: 'http://my.buttercup.dev',
            authorizationUri: "http://my.buttercup.dev/oauth/authorize",
            redirectUri: "https://buttercup.pw",
            scopes: []
        });
        chrome.tabs.create({ url: client.token.getUri() });
        return new Promise(function(resolve) {

        });
    }

}

export default MyButtercupAuthenticator;
