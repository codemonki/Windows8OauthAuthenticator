(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/SecretKeys/SecretKeys.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var submitButton = document.getElementById("Submit");
            submitButton.addEventListener("click", this.buttonClickHandler, false);
        },

        // This function is called when the page is unloaded, this is a default function of the auto generated solution
        unload: function () {
        },
        
        // This is a default function of the auto generated solution
        updateLayout: function (element) {
        },

        // This function fires when the 'Submit' button is clicked
        buttonClickHandler: function (eventInfo) {

            // Get the values from the input boxes
            var password = document.getElementById("secretKey").value; //The secret key
            var userName = document.getElementById("keyLabel").value; //General label, Gmail, Dropbox, etc...
            var resource = document.getElementById("accountLabel").value; //Account label, email address

            // Check to ensure that all three fields contain information
            if (password === "" || userName === "" || resource === "") {
                document.getElementById("test").innerHTML = "Error: All three fields need to be entered.";
            } else { //If all three fields do contain information, proceed

                // Create an object for the password vault where account information and tokens are saved
                // To read more about this process, follow the link below
                // http://code.msdn.microsoft.com/windowsapps/PasswordVault-f01be74a/sourcecode?fileId=43888&pathId=1139833673
                var vault = new Windows.Security.Credentials.PasswordVault(); //Password vault object
                var cred = new Windows.Security.Credentials.PasswordCredential(resource, userName, password); //The security credential itself(password, usern name)
                vault.add(cred); //Add the credential to the security vault

                // This pushes a flag variable to storage. This will be used on the home page to see if any credentials exist
                // other wise we get errors
                Windows.Storage.ApplicationData.current.localSettings.values["dataExists"] = "true";

                // Clear text boxes
                document.getElementById("secretKey").value = "";
                document.getElementById("keyLabel").value = "";
                document.getElementById("accountLabel").value = "";
            }
        }
    });
})();
