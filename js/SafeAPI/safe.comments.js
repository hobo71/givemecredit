let comments;
async function safe_createComments() {
    try {
        console.log("Initializing Comments dataset...");
        //const hash = await safeApp.crypto.sha3Hash('COMMENTS_DATASET');
        //comments = await safeApp.mutableData.newPublic(hash, 15000);
        comments = await safeApp.mutableData.newRandomPublic(15000);
        await comments.quickSetup();
    } catch (err) {
        console.log(err);
    }
}

async function safe_insertComment(key, value) {
    const mutations = await safeApp.mutableData.newMutation();
    await mutations.insert(key, JSON.stringify(value));
    await comments.applyEntriesMutation(mutations);
}

async function safe_updateComment(key, value, version) {
    const mutations = await safeApp.mutableData.newMutation();
    await mutations.update(key, JSON.stringify(value), version + 1);
    await comments.applyEntriesMutation(mutations);
}

async function safe_deleteComment(key) {
    let items = [];
    items = await safe_getComments();
    const mutations = await safeApp.mutableData.newMutation();
    items.forEach(async(item) => {
        let str = key.localeCompare(item.key);
        if (str == 0) {
            await mutations.delete(item.key, item.version + 1);
        }
    });
    await comments.applyEntriesMutation(mutations);
}


async function safe_getComments() {
    const entries = await comments.getEntries();
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
