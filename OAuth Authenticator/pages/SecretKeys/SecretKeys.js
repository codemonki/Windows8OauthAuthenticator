// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/SecretKeys/SecretKeys.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var submitButton = document.getElementById("Submit");
            submitButton.addEventListener("click", this.buttonClickHandler, false);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },

        buttonClickHandler: function (eventInfo) {
            if (secretKey === "" || label === "" || accountLabel === "") {
                document.getElementById("test").innerHTML = "Error: All three fields need to be entered.";
            } else {
                //Get the value from the input boxes
                var secretKey = document.getElementById("secretKey").value;
                var label = document.getElementById("keyLabel").value;
                var account = document.getElementById("accountLabel").value;

                //convert to more readible variables - this step can be deleted, left for readability
                //if deleted, change variables saved in line 58, saving cred
                var password = secretKey;
                var resource = account;
                var userName = label;

                //create object for password vault
                //reference for password vault
                //http://code.msdn.microsoft.com/windowsapps/PasswordVault-f01be74a/sourcecode?fileId=43888&pathId=1139833673
                var vault = new Windows.Security.Credentials.PasswordVault();
                var cred = new Windows.Security.Credentials.PasswordCredential(resource, userName, password);
                vault.add(cred);

                Windows.Storage.ApplicationData.current.localSettings.values["dataExists"] = JSON.stringify(true);

                //Clear text boxes
                document.getElementById("secretKey").value = "";
                document.getElementById("keyLabel").value = "";
                document.getElementById("accountLabel").value = "";
            }
        }
    });
})();
