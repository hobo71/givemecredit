async function displayUserData() {
    const id = await window.currentWebId["@id"];
    const img = await window.currentWebId["#me"]["image"]["@id"];
    const name = await window.currentWebId["#me"]["name"];
    $('.profile-summary img.user-image-large ').attr("src", img);
    $('.profile-pic-small').attr("src", img);
    $('.profile-summary h4#fullName').html(name);
    $(".rateYo").rateYo({
        rating: 3.6,
        fullStar: true,
        starWidth: "20px",
        readOnly: true
    });

    let users = [];
    users = await listUsers();
    users.forEach(async(user) => {
        console.log(user);
        let str = id.localeCompare(user.value.webID);
        if (str == 0) {
            let socialCredits = (user.value.socialCredits).toFixed(2);
            $('.sc div').html(socialCredits);
            $('.hc div').html(user.value.healthCredits);
            $('.ec div').html(user.value.educationCredits);
            let balance = await getBalance(user.value.pubKey);
            $('.rebate div').html(balance);
        }
    });
    
   let items = [];
   items = await getAllBalances();
   items.forEach(async(item) => {
       console.log(item);
   });
}
