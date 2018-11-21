var gunAPI = {
    applyAsCandidate: function (position) {
        gun.get('users').once(function (data) {
            gun.get('pub/' + data.pubKey).once(function (result) {
                gun.get('candidates').set({
                    name: result.name,
                    photo: result.photo,
                    position: position,
                    rating: "0%"
                });
            });
        });
    },
    getTotalUsers: function (cb) {
        var count = 0;
        gun.get('users').map().on(function (data) {
            count++;
        });
        cb(count);
    },
    electCandidate: function (candidate) {
        let totalUpVotes = 1; //this will need to be updated i.e. gun.get('candidateScores').put({name/pubkey: score, score: score})... 
        gunAPI.getTotalUsers(function (count) {
            var rating = (count / totalUpVotes) * 100 + "%";
            gun.get('candidates').map().on(function (data) {
                if (data.name === candidate) { //and approval rating >= 65
                    gun.get('elected').set({
                        name: data.name,
                        photo: data.photo,
                        position: data.position,
                        rating: rating
                    });
                }
            });



            /* gun.get('candidates').map().on(function (data) {
                 if (data.name === candidate) { //and approval rating >= 65
                     console.log(candidate);
                     let candidateSummary = `<div><div class="rateYo"></div>
                 <h4><a href="#/profile">${data.name}</a></h4>
                 <p class="position">${data.position}</p>
                 <img src="${data.photo}" class="user-image-large" alt="User Image">
                 <p>Approval rating: <b>${rating}</b></p>
                 <button class="btn btn-red disconnect">DISCONNECT</button>
             </div>`;
                     $('.localOfficials').append(candidateSummary);
                     $(".rateYo").rateYo({
                         rating: data.rating,
                         starWidth: "15px",
                         readOnly: true
                     });
                     gun.get('elected').set({
                         name: data.name,
                         photo: data.photo,
                         position: data.position,
                         rating: rating
                     });
                 }
             });*/
        });
    },
    listElected: function () {
        gun.get('elected').map().on(function (data) {
            let candidateSummary = `<div>
                <div class="rateYo"></div>
                <h4><a href="#/profile">${data.name}</a></h4>
                <p class="position">${data.position}</p>
                <img src="${data.photo}" class="user-image-large" alt="User Image">
                <p>Approval rating: <b>${data.rating}</b></p>
                <button class="btn btn-red connect">CONNECT</button>
            </div>`;
            $('.localOfficials').append(candidateSummary);
            $(".rateYo").rateYo({
                rating: data.rating,
                starWidth: "15px",
                readOnly: true
            });
        });
    },
    listCandidates: function () {
        gun.get('candidates').map().on(function (data) {
            let candidateSummary = `<div>
                <div class="rateYo"></div>
                <h4><a href="#/profile">${data.name}</a></h4>
                <p class="position">${data.position}</p>
                <img src="${data.photo}" class="user-image-large" alt="User Image">
                <p>Approval rating: <b>${data.rating}</b></p>
                <button class="btn btn-red connect">CONNECT</button>
            </div>`;
            $('.localCandidates').append(candidateSummary);
            $(".rateYo").rateYo({
                rating: data.rating,
                starWidth: "15px",
                readOnly: true
            });
        });
    },

}
