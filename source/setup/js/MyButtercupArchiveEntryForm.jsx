import React from "react";

import ArchiveEntryForm from "./ArchiveEntryForm";

class MyButtercupArchiveEntryForm extends ArchiveEntryForm {

    componentWillMount() {
        this.setState({
            submitEnabled: false,
            type: "mybuttercup",
            authenticated: false,
            mybuttercup_token: ""
        });
    }

    onAuthenticateClicked(event) {
        event.preventDefault();
        this.enable(false);
        chrome.runtime.sendMessage({ command: "authenticate-mybuttercup" }, (response) => {
            if (response && response.ok === true) {
                this.onAuthenticated(response.token);
            } else {
                let errorMessage = (response && response.error) || "Unknown error";
                alert("There was an error trying to authenticate with MyButtercup:\n" + errorMessage);
                this.enable(true);
            }
        });
    }

    onAuthenticated(token) {
        this.setState({
            submitEnabled: true,
            authenticated: true,
            mybuttercup_token: token
        });
        this.enable(true);
    }

    renderFormContents() {
        return (
            <div>
                {super.renderFormContents()}
                <div className="row">
                    <button
                        onClick={(e) => this.onAuthenticateClicked(e)}
                        disabled={this.state.authenticated}
                        >
                        Authenticate My Buttercup account
                    </button>
                </div>
                <input type="hidden" name="mybuttercup_token" value={this.state.mybuttercup_token} />
            </div>
        );
    }

}

export default MyButtercupArchiveEntryForm;
