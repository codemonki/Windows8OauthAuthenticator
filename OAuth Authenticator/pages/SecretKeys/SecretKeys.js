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

        //This function is called when the page is unloaded, this is a default function of the auto generated solution
        unload: function () {
            // TODO: Respond to navigations away from this page.
        },
        
        //This is a default function of the auto generated solution
        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },

        //This function fires when the 'Submit' button is clicked
        buttonClickHandler: function (eventInfo) {

            //Check to ensure that all three fields contain information
            if (secretKey === "" || label === "" || accountLabel === "") {
                document.getElementById("test").innerHTML = "Error: All three fields need to be entered.";
            } else {
                //If all three fields do contain information, proceed
                //Get the values from the input boxes
                var secretKey = document.getElementById("secretKey").value;
                var label = document.getElementById("keyLabel").value;
                var account = document.getElementById("accountLabel").value;

                //Convert the above values to more readible variables - this step can be deleted but is left for readability
                //if deleted, change variables names in the 'cred' variable declaration
                var password = secretKey;
                var resource = account;
                var userName = label;

                //Create an object for the password vault where account information and tokens are saved
                //To read more about this process, follow the link below
                //http://code.msdn.microsoft.com/windowsapps/PasswordVault-f01be74a/sourcecode?fileId=43888&pathId=1139833673
                var vault = new Windows.Security.Credentials.PasswordVault(); //Password vault object
                var cred = new Windows.Security.Credentials.PasswordCredential(resource, userName, password); //The security credential (password, usern name)
                vault.add(cred); //Add the credential to the security vault

                //This pushes a flag variable to open storage. This will be used on the home page to see if any dcredentials 
                //have been created by this app. 
                Windows.Storage.ApplicationData.current.localSettings.values["dataExists"] = JSON.stringify(true);

                //Clear text boxes
                document.getElementById("secretKey").value = "";
                document.getElementById("keyLabel").value = "";
                document.getElementById("accountLabel").value = "";
            }
        }
    });
})();
