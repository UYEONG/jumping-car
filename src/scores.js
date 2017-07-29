let firebase;
let limit = 100;

const scores = {
    firebase(fb) {
        firebase = fb;
    },
    select() {
        return firebase
            .database()
            .ref('scores')
            .limitToFirst(limit)
            .once('value')
            .then((snapshot) => {
                let result = [];
                snapshot.forEach(d => !result.push(d.val()));
                return result;
            });
    },
    insert(initials, score) {
        return firebase
            .database()
            .ref('scores')
            .push({initials, score: score})
            .then((r) => r.setPriority(-score));
    }
};

export default scores;
