(function () {
    "use strict";

    // Global function Variables
    var countDownTimer;
    var systemTime;
    var currentTime;
    var intervalID = "";
    var lasttimestamp;
    var secretKeys = [];
    var keyLabels = [];
    var accountLabels = [];

    // create list view objects
    var listViewContext;
    var listViewSelection;
    var list = [];
    var dataList = new WinJS.Binding.List(list); // listview object
    var displayList = WinJS.Binding.as(dataList); // bind listview object to an observable object to update text, this step needs done before making public
    var publicMembers =
    {
        itemList: displayList
    };
    WinJS.Namespace.define("ListView", publicMembers); // expose listview object as a public member

    //Page control functions
    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        // This is an auto generated function made by the solution
        ready: function (element, options) {
            WinJS.Utilities.query("a").listen("click", this.linkClickEventHandler, false);
            fnStartInterval();

            // Context menu events
            document.getElementById("basicListView").addEventListener("click", attachmentHandler, false);
            listViewContext = element.querySelector("#basicListView").winControl;
            listViewContext.addEventListener("selectionchanged", this.selectionChanged);
        },

        // This is an auto generated function made by the solution
        unload: function () {
            // TODO: Respond to navigations away from this page.
            fnStopInterval();
        },

        // This is an auto generated function made by the solution
        linkClickEventHandler: function (eventInfo) {
            eventInfo.preventDefault();
            var link = eventInfo.target;
            WinJS.Navigation.navigate(link.href);
        },

        // Change the selection of the object selected in the listView
        selectionChanged: function (eventInfo) {
            listViewSelection = listViewContext.selection.getIndices();
        }

    }); // End page controls

    //Timer start function
    function fnStartInterval() {
        if (intervalID == "") {
            intervalID = window.setInterval(refresh, 1000);
        } else {
            fnStopInterval();
        }
    }

    // Timer stop function
    // The timer continues to run when the user navigates away from the home page
    // thus we need to stop it or else it will produce errors
    function fnStopInterval() {
        if (intervalID != "") {
            window.clearInterval(intervalID);
            intervalID = "";
        }
    }

    // This function will refresh and update the 2 step codes every 30 seconds
    function refresh() {
        systemTime = Math.floor(new Date().getTime() / 1000);
        if (window.focus) {
            timer();
            //document.getElementById('timeLeft').innerHTML = Math.floor(systemTime % 30);
            document.getElementById('timeLeft').innerHTML = countDownTimer;
        }
        if (Windows.Storage.ApplicationData.current.localSettings.values["dataExists"]) {
            currentTime = Math.floor(systemTime / 30);
            if (currentTime != lasttimestamp) {
                lasttimestamp = currentTime;
                generateKeys()
            }
        }
    }

    // This function generates the one time password
    // It is provided by Google under the Apache license
    // https://code.google.com/p/google-authenticator/source/browse/libpam/totp.html
    function totp(K, t) {
        function sha1(C) {
            function L(x, b) { return x << b | x >>> 32 - b; }
            var l = C.length, D = C.concat([1 << 31]), V = 0x67452301, W = 0x88888888,
                Y = 271733878, X = Y ^ W, Z = 0xC3D2E1F0; W ^= V;
            do D.push(0); while (D.length + 1 & 15); D.push(32 * l);
            while (D.length) {
                var E = D.splice(0, 16), a = V, b = W, c = X, d = Y, e = Z, f, k, i = 12;
                function I(x) { var t = L(a, 5) + f + e + k + E[x]; e = d; d = c; c = L(b, 30); b = a; a = t; }
                for (; ++i < 77;) E.push(L(E[i] ^ E[i - 5] ^ E[i - 11] ^ E[i - 13], 1));
                k = 0x5A827999; for (i = 0; i < 20; I(i++)) f = b & c | ~b & d;
                k = 0x6ED9EBA1; for (; i < 40; I(i++)) f = b ^ c ^ d;
                k = 0x8F1BBCDC; for (; i < 60; I(i++)) f = b & c | b & d | c & d;
                k = 0xCA62C1D6; for (; i < 80; I(i++)) f = b ^ c ^ d;
                V += a; W += b; X += c; Y += d; Z += e;
            }
            return [V, W, X, Y, Z];
        }
        var k = [], l = [], i = 0, j = 0, c = 0;
        for (; i < K.length;) {
            c = c * 32 + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.
              indexOf(K.charAt(i++).toUpperCase());
            if ((j += 5) > 31) k.push(Math.floor(c / (1 << (j -= 32)))), c &= 31;
        }
        j && k.push(c << (32 - j));
        for (i = 0; i < 16; ++i) l.push(0x6A6A6A6A ^ (k[i] = k[i] ^ 0x5C5C5C5C));
        var s = sha1(k.concat(sha1(l.concat([0, t])))), o = s[4] & 0xF;
        return ((s[o >> 2] << 8 * (o & 3) | (o & 3 ? s[(o >> 2) + 1] >>> 8 * (4 - o & 3) : 0)) & -1 >>> 1) % 1000000;
    }

    function generateKeys() {
        generateListArray()
        for (var x = 0; x < secretKeys.length; x++) {
            var key = secretKeys[x].replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]/gi, '');
            var code = totp(key, currentTime);
            code = code.toString();
            switch (code.length) {
                case 0:
                    code = "000000";
                    break;
                case 1:
                    code = "00000" + code;
                    break;
                case 2:
                    code = "0000" + code;
                    break;
                case 3:
                    code = "000" + code;
                    break;
                case 4:
                    code = "00" + code;
                    break;
                case 5:
                    code = "0" + code;
                    break;
                default:
                    break;
            }

            secretKeys[x] = code;
            updateList();
        }
    }

    // Updates the one time passcodes when needed
    function updateList() {
        displayList.length = 0;
        for (var x = 0; x < secretKeys.length; x++) {
            displayList.push({ Label: keyLabels[x], Key: secretKeys[x], Account: accountLabels[x] })
        }
    }

    // Pulls the credentials from the secure password vault and pushes them to an array for processing
    // and list view generation
    function generateListArray() {
        secretKeys.length = 0;
        keyLabels.length = 0;
        accountLabels.length = 0;
        var vault = new Windows.Security.Credentials.PasswordVault(); //Creates password vault object
        var creds = vault.retrieveAll(); //Retrieves all credentials from the vault
        for (var x = 0; x < creds.size; x++) { //Pulls each credential out and stores each piece into an array for processing
            var cred = vault.retrieve(creds.getAt(x).resource, creds.getAt(x).userName);
            secretKeys.push(cred.password.toString());
            keyLabels.push(cred.userName.toString());
            accountLabels.push(cred.resource.toString());
        }
    }

    function timer() {
        countDownTimer = Math.floor(systemTime % 30);
        switch (countDownTimer) {
            case 0:
                countDownTimer = 30;
                break;
            case 1:
                countDownTimer = 29;
                break;
            case 2:
                countDownTimer = 28;
                break;
            case 3:
                countDownTimer = 27;
                break;
            case 4:
                countDownTimer = 26;
                break;
            case 5:
                countDownTimer = 25;
                break;
            case 6:
                countDownTimer = 24;
                break;
            case 7:
                countDownTimer = 23;
                break;
            case 8:
                countDownTimer = 22;
                break;
            case 9:
                countDownTimer = 21;
                break;
            case 10:
                countDownTimer = 20;
                break;
            case 11:
                countDownTimer = 19;
                break;
            case 12:
                countDownTimer = 18;
                break;
            case 13:
                countDownTimer = 17;
                break;
            case 14:
                countDownTimer = 16;
                break;
            case 15:
                countDownTimer = 15;
                break;
            case 16:
                countDownTimer = 14;
                break;
            case 17:
                countDownTimer = 13;
                break;
            case 18:
                countDownTimer = 12;
                break;
            case 19:
                countDownTimer = 11;
                break;
            case 20:
                countDownTimer = 10;
                break;
            case 21:
                countDownTimer = 9;
                break;
            case 22:
                countDownTimer = 8;
                break;
            case 23:
                countDownTimer = 7;
                break;
            case 24:
                countDownTimer = 6;
                break;
            case 25:
                countDownTimer = 5;
                break;
            case 26:
                countDownTimer = 4;
                break;
            case 27:
                countDownTimer = 3;
                break;
            case 28:
                countDownTimer = 2;
                break;
            case 29:
                countDownTimer = 1;
                break;
            case 30:
                countDownTimer = 0;
                break;
            default:
                break;
        }
    }

    // Context menu functions
    function attachmentHandler(e) {
        // Create a menu and add commands with callbacks. 
        var menu = new Windows.UI.Popups.PopupMenu();
        menu.commands.append(new Windows.UI.Popups.UICommand("Copy", copyKey));
        menu.commands.append(new Windows.UI.Popups.UICommand("Delete", deleteKey));
        menu.showAsync(pageToWinRT(e.pageX, e.pageY)).then(function (invokedCommand) {
        });
    }

    function pageToWinRT(pageX, pageY) {
        var zoomFactor = document.documentElement.msContentZoomFactor;
        return {
            x: (pageX - window.pageXOffset) * zoomFactor,
            y: (pageY - window.pageYOffset) * zoomFactor
        };
    }

    function copyKey() {
        var dataPackage = new Windows.ApplicationModel.DataTransfer.DataPackage();
        dataPackage.setText(secretKeys[listViewSelection]);
        Windows.ApplicationModel.DataTransfer.Clipboard.setContent(dataPackage);
        listViewContext.selection.clear();
    }

    function deleteKey() {
        var vault = new Windows.Security.Credentials.PasswordVault(); //Creates password vault object
        var cred = vault.retrieve(accountLabels[listViewSelection], keyLabels[listViewSelection]); //Retrieves all credentials from the vault
        vault.remove(cred);
        listViewContext.selection.clear();
        generateKeys()
    }
    // End context menu functions
})();





