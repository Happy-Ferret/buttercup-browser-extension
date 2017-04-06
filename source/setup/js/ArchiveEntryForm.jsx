import React from "react";
import { hashHistory } from "react-router";

class ArchiveEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connect: "existing",
            loading: false,
            master_password: "",
            name: "",
            submitEnabled: true,
            submitLabel: "Connect",
            type: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    enable(en = true) {
        this.setState({ loading: !en });
    }

    handleChange(event) {
        let input = event.target,
            name = input.getAttribute("name"),
            value = input.value;
        this.setState({
            [name]: value
        });
    }

    handleCreateNewChange() {
        this.setState({
            connect: this.state.connect === "existing" ? "new" : "existing"
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.enable(false);
        chrome.runtime.sendMessage({ command: "add-archive", data: this.state }, (response) => {
            if (response && response.ok === true) {
                hashHistory.push("/");
            } else {
                alert("There was an error processing the provided archive details:\n" + response.error);
                this.enable(true);
            }
        });
    }

    render() {
        return <form className="buttercup">
            <fieldset disabled={this.state.loading}>
                {this.renderFormContents()}
                <div className="row">
                    <input
                        id="create-new-cb"
                        type="checkbox"
                        checked={this.state.connect === "new"} 
                        onChange={() => this.handleCreateNewChange()}
                        />
                    <label htmlFor="create-new-cb">Create new archive at path</label>
                </div>
                <div className="row">
                    <button
                        disabled={!this.state.submitEnabled}
                        onClick={this.handleSubmit}
                        >
                        {this.state.submitLabel}
                    </button>
                </div>
            </fieldset>
        </form>;
    }

    renderFormContents() {
        return (
            <div>
                <div className="row">
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    <label>Title</label>
                </div>
                <div className="row">
                    <input type="password" name="master_password" value={this.state.master_password} onChange={this.handleChange} />
                    <label>Archive password</label>
                </div>
            </div>
        );
    }

}

export default ArchiveEntryForm;
