/**
 * Created by liaobonn on 18/05/17.
 *
 * Route used to handle all browse services
 */

module.exports = function (app, pool) {
    app.get('/browse/all', function (req, res) {
        let pageData = {
            title: 'Browse All Vinyls',
            heading: 'All',
            description: "Browse all vinyl records",
        };

        pool.connect()
            .then(client => {
                let sql = "SELECT id, title, artist_id, price FROM albums;";

                client.query(sql)
                    .then(result => {
                        client.release();
                        pageData.albums = result.rows;
                        res.render('browse', pageData);

                        console.log(`[Log] Sending all ${result.rowCount} albums to the client`);
                    })
                    .catch(e => {
                        client.release();
                        pageData.error = "Database error occurred, please refresh or contact hectorcaesar@hotmail.com.";
                        res.render('browse', pageData);
                        console.error('[ERROR] Query error', e.message, e.stack);
                    });
            })
            .catch(error => {
                pageData.error = "Database unavailable, please try again.";
                res.render('browse', pageData);
                console.error('[ERROR] Unable to connect to database', error.message, error.stack);
            });
    });

    app.get('/browse/artist', function (req, res) {
        let pageData = {
            title: 'Browse Artists',
            heading: 'Artists',
            description: "Browse all artists of the vinyls we sell."
        };

        pool.connect()
            .then(client => {
                let sql = "SELECT id, artist_name FROM artists;";

                client.query(sql)
                    .then(result => {
                        client.release();
                        pageData.artists = result.rows;
                        res.render('browse', pageData);

                        console.log(`[Log] Sending all ${result.rowCount} albums to the client`);
                    })
                    .catch(e => {
                        client.release();
                        pageData.error = "Database error occurred, please refresh or contact hectorcaesar@hotmail.com.";
                        res.render('browse', pageData);
                        console.error('[ERROR] Query error', e.message, e.stack);
                    });
            })
            .catch(error => {
                pageData.error = "Database unavailable, please try again.";
                res.render('browse', pageData);
                console.error('[ERROR] Unable to connect to database', error.message, error.stack);
            });
    });
}
