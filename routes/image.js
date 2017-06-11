/**
 * Created by liaobonn on 28/05/17.
 */
module.exports = function(app, pool, path){

    app.get('/image/large/:id', function(req, res){
        var id = req.params.id;
        let pageData = {};

        pool.connect()
            .then(client => {
                let sql = "select * from albums where id=" + id + ";";

                client.query(sql)
                    .then(result => {
                        client.release();
                        if(result.rows[0].test_image){
                            var buffer = new Buffer(result.rows[0].test_image, "base64");
                            res.writeHead(200, {'Content-Type' : 'image/jpg'});
                            res.end(buffer, 'binary');
                            console.log(`[Log] Sending all ${result.rowCount} albums to the client`);
                        } else {
                            res.sendFile(path.join(__dirname, '../public/img', '350x350_placeholder.png'));
                        }
                    })
                    .catch(e => {
                        client.release();
                        console.error('[ERROR] Query error', e.message, e.stack);
                    });
            })
            .catch(error => {
                console.error('[ERROR] Unable to connect to database', error.message, error.stack);
            });
    });

    app.get('/image/medium/:id', function(req, res){
        var id = req.params.id;
        let pageData = {};

        pool.connect()
            .then(client => {
                let sql = "select * from albums where id=" + id + ";";

                client.query(sql)
                    .then(result => {
                        client.release();
                        if(result.rows[0].test_image){
                            var buffer = new Buffer(result.rows[0].test_image, "base64");
                            res.writeHead(200, {'Content-Type' : 'image/jpg'});
                            res.end(buffer, 'binary');
                            console.log(`[Log] Sending all ${result.rowCount} albums to the client`);
                        } else {
                            res.sendFile(path.join(__dirname, '../public/img', '175x175_placeholder.png'));
                        }
                    })
                    .catch(e => {
                        client.release();
                        console.error('[ERROR] Query error', e.message, e.stack);
                    });
            })
            .catch(error => {
                console.error('[ERROR] Unable to connect to database', error.message, error.stack);
            });
    });

    app.get('/image/small/:id', function(req, res){
        var id = req.params.id;
        let pageData = {};

        pool.connect()
            .then(client => {
                let sql = "select * from albums where id=" + id + ";";

                client.query(sql)
                    .then(result => {
                        client.release();
                        if(result.rows[0].test_image){
                            var buffer = new Buffer(result.rows[0].test_image, "base64");
                            res.writeHead(200, {'Content-Type' : 'image/jpg'});
                            res.end(buffer, 'binary');
                            console.log(`[Log] Sending all ${result.rowCount} albums to the client`);
                        } else {
                            res.sendFile(path.join(__dirname, '../public/img', '30x30_placeholder.png'));
                        }
                    })
                    .catch(e => {
                        client.release();
                        console.error('[ERROR] Query error', e.message, e.stack);
                    });
            })
            .catch(error => {
                console.error('[ERROR] Unable to connect to database', error.message, error.stack);
            });
    });

    let sql = "select * from artist_images where artist_id = $1;";

    app.get("/image/artists/:size/:id", function (request, response) {
        let id = request.params.id;

        let defaultImagePath;
        switch (request.params.size) {
            case "large":
                defaultImagePath = "350x350_placeholder.png";
                break;
            case "medium":
                defaultImagePath = "175x175_placeholder.png";
                break;
            case "small":
                defaultImagePath = "30x30_placeholder.png";
                break;
        }

        pool.query(sql, [id])
            .then(result => {
                if (result.rows[0]) {
                    let buffer = new Buffer(result.rows[0].image, "base64");
                    response.writeHead(200, {'Content-Type': 'image/jpg'});
                    response.end(buffer, 'binary');
                } else {
                    response.sendFile(path.join(__dirname, "../public/img", defaultImagePath));
                }
            })
            .catch(e => {
                console.error("[ERROR] Query error", e.message, e.stack);
            });
    });
};
