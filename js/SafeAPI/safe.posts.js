/***************** Posts table (need to change the names) *****************/

let md;
async function createPosts() {
    //md = await safeApp.mutableData.newRandomPublic(typeTag);
    try {
        console.log("Initializing posts dataset...");
        const hash = await safeApp.crypto.sha3Hash('POSTS');
        md = await safeApp.mutableData.newPublic(hash, 15000);
        /*const initialData = {
            "random_key_1": JSON.stringify({
                webID: "safe://glen.devolution",
                date: "14 Jan, 2019",
                img: "safe://hygjurfty4kddbj6q7rgn9kq63djis73i17kbezddbd7afiynqhpqggjxixpy",
                name: "Glen Simister",
                post: "Welcome to DEVOLUTION - The evolution of decentralized governance."
            })
        };
        await md.quickSetup(initialData);*/
    } catch (err) {
        console.log(err);
    }
}

async function insertItem(key, value) {
    const mutations = await safeApp.mutableData.newMutation();
    await mutations.insert(key, JSON.stringify(value));
    await md.applyEntriesMutation(mutations);
}

async function updateItem(key, value, version) {
    const mutations = await safeApp.mutableData.newMutation();
    await mutations.update(key, JSON.stringify(value), version + 1);
    await md.applyEntriesMutation(mutations);
}

async function deleteItems(key) {
    let items = [];
    items = await getItems();
    const mutations = await safeApp.mutableData.newMutation();
    items.forEach(async(item) => {
        if (item.key == key) {
            await mutations.delete(item.key, item.version + 1);
        }
    });
    await md.applyEntriesMutation(mutations);
}

async function getItems() {
    const entries = await md.getEntries();
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