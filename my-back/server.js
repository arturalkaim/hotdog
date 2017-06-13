'use strict';

const Hapi = require('hapi');
var corsHeaders = require('hapi-cors-headers')

const Path = require("path");
const Boom = require("boom");
const Aguid = require("aguid");
const Good = require('good');
const Inert = require('inert');
const fs = require("fs");
const Promise = require("bluebird");
const Request = require("request-promise");
var writeFile = Promise.promisify(fs.writeFile);

const server = new Hapi.Server();

var mongoose = require('mongoose');
var File = require('./models').File;

var dbUrl = 'mongodb://localhost:27017/hotdog'

var options = {
    bluebird: false,
};
var dbOtions = {
    db: { native_parser: true },
    server: { poolSize: 5 }
};

server.connection({
    port: 3000,
    host: 'localhost',
    routes: { cors: true }
});

let plugins = [
	Good, Inert
]


server.register(plugins, function (err) {
        if (err) {
            throw err;
        }
        server.start((err) => {
            if (err) {
                throw err;
            }
            mongoose.connect(dbUrl, dbOtions, function(err) {
                if (err) server.log('error', err);
            });
            console.log(`Server running at: ${server.info.uri}`);
    });

 });


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/images/{filename}',
    handler: {
        file: (request) => {
			return "public/"+request.params.filename;
		}
    }
});

server.route({
    method: 'GET',
    path: '/images',
    handler: function (request, reply) {
        File.find({}, (err, files)=> {
           return reply(files);
        });
    }
});

server.route({
    method: 'POST',
    path: '/upload',
    config: {
        payload: {
            maxBytes: 15242880,
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
		},
    },
    handler: function (request, reply) {
        let files = request.payload.file
        console.log(request.payload)
        if (files && files instanceof Array) {
            let fileNames = []
            files.forEach(function(file) {
                storeFile(file).then((filename) => {
                    fileNames.push(filename);
                });             
            }, this);
            return reply(fileNames);
        }else if(files){
            storeFile(files).then((filename) => {
                return reply(filename);
            });             
        }
        else {
            return reply(Boom.badRequest("You must submit a valid image"));
        }
    }
});

server.ext('onPreResponse', corsHeaders)

function storeFile(uploadedFile) {
	return new Promise((resolve, reject) => {
		let extension = Path.extname(uploadedFile.hapi.filename);
		let name = Aguid() + extension;

		let path = Path.join(__dirname, "public/", name);
		let file = fs.createWriteStream(path);

		file.on('error', (error) => {
			console.error(error);
			return reject(error.message);
		});

		uploadedFile.pipe(file);

		uploadedFile.on('end', (error) => {
			if (error) { return reject(error.message); }
            let file = new File({name});
            file.save();
			return resolve(name);
		});
	});
}