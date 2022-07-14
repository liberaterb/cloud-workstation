const db = require('../database/index')

module.exports = {
    readPage(page, size, isImp) {
        let sql
        if (Number(isImp) === 1) {
            sql = `SELECT * FROM wlist WHERE important = 1 LIMIT $size OFFSET $offset`;
        }else{
            sql = `SELECT * FROM wlist LIMIT $size OFFSET $offset`;
        }
        console.log(sql);
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(sql, {
                    $size: size,
                    $offset: (page - 1) * size
                }, (err, data) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })
            })
        })
    },
    readTotal() {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.get(`SELECT COUNT(*) AS total
                        FROM wlist`, (err, data) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })
            })
        })
    },
    add({english, chinese, sentence, fayin}) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('INSERT INTO wlist(english, chinese, sentence, fayin) values ($english, $chinese, $sentence, $fayin)', {
                    $english: english,
                    $chinese: chinese,
                    $sentence: sentence,
                    $fayin: fayin
                }, (err, data) => {
                    if (err) {
                        reject(err)
                    }
                    resolve()
                })
            })
        })
    },
    selectOne(english) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all('select * from wlist where english = $english limit 1', {
                    $english: english
                }, (err, data) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })
            })
        })
    },
    delete(english) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('delete from wlist where english = $english', {
                    $english: english
                }, (err, data) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })
            })
        })
    },
    changeImportant(word){
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('update wlist set important = $important where english = $english', {
                    $important: word.important,
                    $english: word.english
                }, (err, data) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })
            })
        })
    }
}
