({
    /****
    * @description Loads the enablement state and enables/disables page elements based on it
    */
    loadState: function (component) {
        var action = component.get("c.loadState");

        action.setCallback(this, function (response) {
            let state = response.getState();

            if (component.isValid() && state === "SUCCESS") {
                var enablementState = JSON.parse(response.getReturnValue());

                if (!enablementState.isReady && !enablementState.isEnabled) {
                    this.displayElement(component, "enablement-disabled");
                    return;
                }

                this.displayElement(component, "enabler");

                component.set('v.state', enablementState);

                if (enablementState.isConfirmed) {
                    this.disableEdit(component, "enable-confirm");
                }

                if (!enablementState.isConfirmed || enablementState.isEnabled) {
                    this.disableEdit(component, "enable-toggle");
                }

                this.refreshMetaDeploy(component);


            } else if (state === "ERROR") {
                this.handleError(component, response.getError());
            }
        });

        $A.enqueueAction(action);
    },
    /****
    * @description Disables page elements and reloads the enablement state
    */
    refreshView: function (component) {
        this.hideElement(component, "enablement-disabled");
        this.hideElement(component, "enabler");

        this.loadState(component);
    },
    /****
    * @description Accepts enhanced Recurring Donations enablement
    */
    confirmEnable: function (component) {
        this.disableEdit(component, "enable-confirm");

        var action = component.get('c.confirmEnablement');

        action.setCallback(this, function (response) {
            var state = response.getState();

            if (!component.isValid()) {
                return;
            }

            if (state === 'SUCCESS') {
                component.set('v.state.isEnableConfirmed', true);
                this.enableEdit(component, "enable-toggle");

            } else if (state === 'ERROR') {
                this.enableEdit(component, "enable-confirm");

                this.handleError(component, response.getError());
            }
        });

        $A.enqueueAction(action);
    },
    /****
    * @description Enables enhanced Recurring Donations 
    */
    completeEnable: function (component) {
        this.disableEdit(component, "enable-toggle");

        var action = component.get('c.enableEnhancement');

        action.setCallback(this, function (response) {
            var state = response.getState();

            if (!component.isValid()) {
                return;
            }

            if (state === 'SUCCESS') {
                component.set('v.state.isEnabled', true);
                this.refreshMetaDeploy(component);

            } else if (state === 'ERROR') {
                this.enableEdit(component, "enable-toggle");
                this.handleError(component, response.getError());
            }
        });

        $A.enqueueAction(action);
    },
    /****
    * @description Confirms MetaDeploy has been installed
    */
    launchDeploy: function (component) {
        this.enableEdit(component, "metadeploy-confirm");

        var action = component.get('c.launchMetaDeploy');

        action.setCallback(this, function (response) {
            var state = response.getState();

            if (!component.isValid()) {
                return;
            }

            if (state === 'SUCCESS') {
                component.set('v.state.isMetaDeployLaunched', true);
                this.refreshMetaDeploy(component);

            } else if (state === 'ERROR') {
                this.disableEdit(component, "metadeploy-confirm");

                this.handleError(component, response.getError());
            }
        });

        $A.enqueueAction(action);
    },
    /****
    * @description Confirms MetaDeploy has been installed
    */
    confirmDeploy: function (component) {
        this.disableEdit(component, "metadeploy-confirm");

        var action = component.get('c.confirmMetaDeploy');

        action.setCallback(this, function (response) {
            var state = response.getState();

            if (!component.isValid()) {
                return;
            }

            if (state === 'SUCCESS') {
                component.set('v.state.isMetaDeployConfirmed', true);
                this.refreshMetaDeploy(component);

            } else if (state === 'ERROR') {
                this.enableEdit(component, "metadeploy-confirm");

                this.handleError(component, response.getError());
            }
        });

        $A.enqueueAction(action);
    },
    /****
    * @description 
    */
    refreshMetaDeploy: function (component) {
        let enablementState = component.get("v.state");

        if (enablementState.isEnabled) {
            this.enableEdit(component, "metadeploy-link");
        } else {
            this.disableEdit(component, "metadeploy-link");
        }

        if (!enablementState.isMetaDeployLaunched || enablementState.isMetaDeployConfirmed) {
            this.disableEdit(component, "metadeploy-confirm");
        } else {
            this.enableEdit(component, "metadeploy-confirm");
        }

        let metaDeployProgress = 0;
        if (enablementState.isMetaDeployConfirmed) {
            metaDeployProgress = 100;
        } else if (enablementState.isMetaDeployLaunched) {
            metaDeployProgress = 50;
        }

        component.set('v.state.metaDeployProgress', metaDeployProgress);
    },
    /****
    * @description Hides component's element
    */
    hideElement: function (component, elementName) {
        let element = component.find(elementName);
        $A.util.addClass(element, "slds-hide");
    },
    /****
    * @description Displays component's element
    */
    displayElement: function (component, elementName) {
        let element = component.find(elementName);
        $A.util.removeClass(element, "slds-hide");
    },
    /****
    * @description Disables input field edit
    */
    disableEdit: function (component, inputName) {
        let inputComp = component.find(inputName);
        $A.util.addClass(inputComp, "editDisabled");
    },
    /****
    * @description Enables input field edit
    */
    enableEdit: function (component, inputName) {
        let inputComp = component.find(inputName);
        $A.util.removeClass(inputComp, "editDisabled");
    },
    /**
     * @description: Displays errors thrown by Apex method invocations
     * @param errors: Error list
     */
    handleError: function (component, errors) {
        let message;
        if (errors && errors[0] && errors[0].message) {
            message = errors[0].message;
        } else {
            message = 'Unknown error';
        }
        console.log('Unexpected Error: ' + message);//TODO 
    }
})
