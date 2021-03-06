/***************** Officials table *****************/

let officials;
async function safe_createOfficials() {
    console.log("Creating officials table...");
    try {
        const hash = await safeApp.crypto.sha3Hash('OFFICIALS_DATASET');
        officials = await safeApp.mutableData.newPublic(hash, 15000);
    } catch (err) {
        console.log(err);
    }
}

async function safe_insertOfficial(key, value) {
    const mutations = await safeApp.mutableData.newMutation();
    await mutations.insert(key, JSON.stringify(value));
    await officials.applyEntriesMutation(mutations);
}

async function safe_updateOffical(key, value, version) {
    const mutations = await safeApp.mutableData.newMutation();
    await mutations.update(key, JSON.stringify(value), version + 1);
    await officials.applyEntriesMutation(mutations);
}

/**** This is for testing purposes ****/
async function safe_deleteAllOfficials() {
    let items = [];
    items = await safe_listOfficials();
    const mutations = await safeApp.mutableData.newMutation();
    items.forEach(async(item) => {
            await mutations.delete(item.key, item.version + 1);
    });
    await officials.applyEntriesMutation(mutations);
    console.log("All officials have been removed");
}

async function safe_deleteOfficial(key) {
    let items = [];
    items = await safe_listOfficials();
    const mutations = await safeApp.mutableData.newMutation();
    items.forEach(async(item) => {
        if (item.key == key) {
            await mutations.delete(item.key, item.version + 1);
        }
    });
    await officials.applyEntriesMutation(mutations);
}

async function safe_getOfficialUserId(id){
    let userId;
    let items = [];
    items = await safe_listOfficials();
    items.forEach(async(item) => {
        let str = id.localeCompare(item.value.userId);
        if (str == 0) {
            userId = item.value.userId;
        }     
    });
    return userId;
}

async function safe_listOfficials() {
    const entries = await officials.getEntries();
    const entriesList = await entries.listEntries();
    const items = [];
    entriesList.forEach((entry) => {
        const value = entry.value;
        if (value.buf.length == 0) return;
        const parsedValue = JSON.parse(value.buf);
        items.push({
            key: entry.key,
            value: parsedValue,
            version: value.version
        });
    });
    return items;
}
