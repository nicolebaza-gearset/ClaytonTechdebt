({
    /**
     * @description: called during render to place the focus at the start of the form
     */
    callFocus: function(component){
        let openDonationsLink = document.getElementById("selectMatchLink");
        if (openDonationsLink) {
            openDonationsLink.focus();
        } else {
            component.find('donorType').focus();
        }
    },

    /**
     * @description: alerts parent component that form needs to be reset
     */
    cancelForm: function (component, event, helper) {
        helper.sendMessage('onCancel', '');
        component.destroy();
    },

    /**
     * @description: closes match modal
     */
    closeModal: function (component) {
        component.get("v.matchingModalPromise").then(function(modal) {
            modal.close();
        });
    },

    /**
     * @description: alerts parent component that form is loaded
     */
    onFormLoad: function (component, event, helper) {
        helper.sendMessage('hideFormSpinner', '');
    },

    /**
     * @description: alerts parent component that form is loaded
     */
    onDonorChange: function (component, event, helper) {
        var lookupField = component.get("v.donorType") === 'Contact1' ? 'contactLookup' : 'accountLookup';
        var lookupValueIsValidId = (component.find(lookupField).get("v.value")).length === 18;

        if (lookupValueIsValidId) {
            helper.sendMessage('showFormSpinner', '');
            helper.queryOpenDonations(component);
        } else {
            helper.removeOpenDonations(component);
        }
    },

    /**
     * @description: override submit function in recordEditForm to handle hidden fields and validation
     */
    onSubmit: function (component, event, helper) {
        event.preventDefault();
        var completeRow = helper.getRowWithHiddenFields(component, event);
        var validity = helper.validateFields(component, completeRow);

        if (validity.isValid) {
            component.find('recordEditForm').submit(completeRow);
        } else if (validity.missingFields.length !== 0) {
            helper.sendErrorToast(component, validity.missingFields);
        } else {
            //do nothing since data format errors display inline
        }
    },

    /**
     * @description: alerts parent component that record is saved and needs to be reset
     */
    onSuccess: function (component, event, helper) {
        var message = {'recordId': event.getParams().response.id};
        helper.sendMessage('onSuccess', message);
        component.destroy();
    },

    /**
     * @description: alerts parent component that record is saved and needs to be reset
     */
    openMatchModal: function(component, event, helper) {
        component.set('v.matchingModalPromise', component.find('overlayLib').showCustomModal({
            header: component.get('v.matchingModalHeader'),
            body: component.get('v.matchingModalBody'),
            footer: component.get('v.matchingModalFooter'),
            showCloseButton: true
        }));

    },

    /**
     * @description: sets the donor type and alerts the parent. Used to circumvent the unhelpful labeling of Account1/Contact1.
     */
    setDonorType: function (component, event, helper) {
        var donorType = event.getSource().get('v.value');
        component.set('v.donorType', donorType);

        var message = {'donorType': donorType};
        helper.sendMessage('setDonorType', message);
        helper.removeOpenDonations(component);
    }

})