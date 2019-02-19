/***** TO DO *******
- fix bug on voting page (sometime there are duplicate officials and they are not being removed on delete)
- move page-specific css styles into their respective folders
- include page specific css in routing
- change css media queries from mobile first to mobile last
- replace all item.key == key with localcompare
- create breadcrumbs
- sort out voting registration form
- organize settings page into tabs (settings doesn't really need to be popup)
- move reset button into initializeData.html
- remove webId info on other pages so that they only declared once
- go through code and replace all var with let to be consistent
- put all css in SAFE Search and replace image url
- remove select box from toolbar and make SFC blue like on SAFE search
*******************/

$(document).ready(async function () {

    if (!safeExperimentsEnabled) {
        alert("You need to toggle experiments (top right) and/or select a webId (top left)");
    }

    /* popup window for settings */

    $('.fa-gears').on('click', function () {
        $('.settings').load('pages/settings.html', function () {
            $('.settings').dialog({
                title: "General Settings",
                width: "auto",
                draggable: false,
                height: 400
            });
        });
    });

    /**** initialize SAFE app and data sets ****/
    
    await safe_authoriseAndConnect();
    await safe_createUsers();
    await safe_createSafeCoin();
    await safe_createPosts();
    await safe_createOfficials();
    await safe_createComments();
    
    /***** get the webId from the browser *****/
    
    const webId = await window.currentWebId["@id"];
    const webIdImg = await window.currentWebId["#me"]["image"]["@id"];
    const webIdName = await window.currentWebId["#me"]["name"];

    /* intro page */

    $('.enter, .reset').on('click', async function (e) {
        e.stopImmediatePropagation();

        /*** reset DB (for testing purposes) ***/
        
        if ($(this).hasClass('reset')) {
            try {
                await safe_deleteAllUsers();
                await safe_deleteAllOfficials();
                await safe_deleteAllAccounts();
            } catch (err) {
                console.log(err + " Deleting datasets failed");
            }
        } else {
            let verified = await safe_isUserVerified(webId); // check if user exists
            if (!verified) {
                $('#introContainer').fadeOut(2000);
                $('.stars').addClass('animated zoomIn');
                $('.twinkling').addClass('animated zoomIn');
                $('#intro').addClass('animated zoomOut');
                $('#register').show(); //if user is not verified show them the registration form
            } else {
                $('#introContainer').fadeOut(2000);
                $('.stars').addClass('animated zoomIn');
                $('.twinkling').addClass('animated zoomIn');
                $('#intro').addClass('animated zoomOut');
                $('#container').show();
                initializePageRouting();
            }
        }
    });

    /*** the unverified user will be presented with a form. When they click submit a new user is created and account credited ***/

    $(document.body).on('click', '.verifyPostCode', async function (e) {
        e.stopImmediatePropagation();
        let pubKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let guid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        try {
            await safe_createNewUser(webId, webIdImg, webIdName, pubKey);
        } catch (err) {
            console.log(err);
        }

        try {
            await safe_addFunds(guid, {
                pubKey: pubKey,
                balance: 5000
            });
            let bal = await safe_getBalance(pubKey);
            $('.rebate div').html(bal);
        } catch (err) {
            console.log(err + " There was a problem adding funds");
        }
        $('#register').hide();
        $('#container').show();
        initializePageRouting();
    });
});
