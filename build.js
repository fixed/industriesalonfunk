var requirejs = require('requirejs')
,   wrench = require('wrench')
,   cleanCSS = require('clean-css')
,   fs = require('fs');


// delete old build stuff first
process.stdout.write('removing old files...');

if(fs.existsSync('./build/js')){
    wrench.rmdirSyncRecursive('./build/js', false);
    process.stdout.write('...');
}

if(fs.existsSync('./build/img')){
    wrench.rmdirSyncRecursive('./build/img', false);
    process.stdout.write('...');
}

if(fs.existsSync('./build/css')){
    wrench.rmdirSyncRecursive('./build/css', false);
}

process.stdout.write('done!\n');


// copy the img directory
process.stdout.write('copying img files...');

wrench.copyDirSyncRecursive('./src/img', './build/img', {
    forceDelete: true
    , excludeHiddenUnix: true
    , preserveFiles: false
    , inflateSymlinks: false
    , filter: /empty/
});

process.stdout.write('done!\n');


// optimize the javascript
process.stdout.write('optimizing js...');

var jsConf = {
        "baseUrl" : "src/js"
        , "name" : "lib/almond/almond"
        , "paths" : {
            'jquery' : 'lib/jquery/jquery-1.9.1.min'
            , 'plugins' : 'lib/requirejs/plugins'
        }
        , "insertRequire" : ["main"]
        , "include" : "main"
        , "out" : "build/js/main.min.js"
        , "wrap" : true
        , "logLevel" : 2
};

requirejs.optimize(jsConf
,function(){
    process.stdout.write('done!\n');
    buildCSS();
}, function(err){
    if(err){
        console.log(err);
        process.exit();
    }
});


var cssConf = {
    inputFile : "src/css/main.css"
    , outputFile : "build/css/main.min.css"
    , clean_conf : {
        keepSpecialComments : 0
        , keepBreaks : false
        , removeEmpty : true
        , debug : false
        //, root : path with which to resolve absolute @import rules
        //, relativeTo : path with which to resolve relative @import rules
    }
};

function buildCSS(){
    process.stdout.write('optimizing css...');
    var source = fs.readFileSync(cssConf.inputFile).toString();
    process.stdout.write('...');
    var minimized = cleanCSS.process(source,cssConf.clean_conf);
    process.stdout.write('...');
    fs.mkdirSync('./build/css');
    fs.writeFileSync(cssConf.outputFile,minimized);
    process.stdout.write('done!\n');
}
