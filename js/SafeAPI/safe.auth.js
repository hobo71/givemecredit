let safeApp;
async function authoriseAndConnect() {
    let appInfo = {
        name: 'DEVOLUTION',
        id: 'net.devolution.web-app',
        version: '1.0.0',
        vendor: 'Glen Simister.'
    };
    safeApp = await window.safe.initialiseApp(appInfo);
    console.log('Authorising SAFE application...');
    const authReqUri = await safeApp.auth.genAuthUri();
    const authUri = await window.safe.authorise(authReqUri);
    console.log('SAFE application authorised by user');
    await safeApp.auth.loginFromUri(authUri);
    console.log("Application connected to the network");
}