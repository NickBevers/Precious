// const {src, dest} = require("gulp");
const sass = require("gulp-sass");
const {watch, src, dest} = require("gulp");

// function go(done){
//     console.log("Here we go!");
//     done();
// }

function test(done){
    console.log("we're done");
    done();
}

function sass2css(done){
    return src("./sass/**/*.scss").pipe(sass().on("error", sass.logError)).pipe(dest("./dist"));
    done();
}

exports.default = function(done){
    watch("./sass/**/*.scss", sass2css);
    done();
}

exports.test = test;
exports.sass2css = sass2css;

