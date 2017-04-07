import React from "react";

import ArchiveEntryForm from "./ArchiveEntryForm";

const NOPE = function() {};
const fetch = window.fetch;

class MyButtercupArchiveEntryForm extends ArchiveEntryForm {

    componentWillMount() {
        this.setState({
            submitEnabled: false,
            type: "mybuttercup",
            authenticated: false,
            mybuttercup_token: "",
            mybuttercup_archiveid: null,
            archives: []
        });
    }

    fetchArchiveList() {
        fetch(
            "http://my.buttercup.dev/api/v1/archives/",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.state.mybuttercup_token}`
                }
            }
        )
            .then(function(resp) {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error(`Bad response: ${resp.status} ${resp.statusText}`);
            })
            .then(info => {
                if (info.status !== "ok") {
                    throw new Error(`Invalid status received from API: ${info.status}`);
                }
                let selectedID = null;
                if (info.archives.length > 0) {
                    selectedID = info.archives[0].id;
                }
                this.setState({
                    archives: info.archives,
                    mybuttercup_archiveid: selectedID,
                    submitEnabled: true
                });
            });
    }

    onAuthenticateClicked(event) {
        event.preventDefault();
        this.enable(false);
        chrome.runtime.sendMessage({
            command: "set-token-type",
            type: "mybuttercup"
        }, NOPE);
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
        this.setState(
            {
                submitEnabled: false,
                authenticated: true,
                mybuttercup_token: token
            },
            () => {
                this.fetchArchiveList();
            }
        );
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
                <div className="row">
                    {this.state.archives.length > 0 ?
                        <div>
                            <span>Choose an archive:</span>
                            <ul>
                                {this.state.archives.map(archive =>
                                    <li>
                                        <input
                                            type="radio"
                                            name="mybuttercup_archiveid"
                                            value={archive.id}
                                            checked={this.state.mybuttercup_archiveid === archive.id}
                                            />
                                        &nbsp;{archive.name}
                                    </li>
                                )}
                            </ul>
                        </div> : ""}
                </div>
                <input type="hidden" name="mybuttercup_token" value={this.state.mybuttercup_token} />
            </div>
        );
    }

}

export default MyButtercupArchiveEntryForm;
