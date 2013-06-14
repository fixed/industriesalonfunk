var http = require('http')
,   connect = require('connect')
,   config = require('./config.json')
,   app = connect();

app.use('/', connect.static(__dirname + '/public'));

if(config.mode == 'development' || config.mode == 'dev'){

    // dev mode
    // use src folder

    app.use('/js/', connect.static(__dirname + '/src/js'));
    app.use('/css/', connect.static(__dirname + '/src/css'));
    app.use('/img/', connect.static(__dirname + '/src/img'));
} else {

    // production mode
    // use build folder

    app.use('/js', connect.static(__dirname + '/build/js'));
    app.use('/css', connect.static(__dirname + '/build/css'));
    app.use('/img', connect.static(__dirname + '/build/img'));
}

http.createServer(app).listen(config.http.port);

process.stdout.write('listening on port ' + config.http.port + '\n');