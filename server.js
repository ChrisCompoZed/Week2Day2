'use strict'

var http = require('http')
var monk = require('monk')
var jade = require('jade')
var db = monk('localhost/store_shapes')
var strings = db.get('query_strings')

var compiledPostNew = jade.compileFile('./postnew.jade', {pretty: true}) 
var compiledGetAll = jade.compileFile('./getall.jade', {pretty: true}) 

function requesthandler(req, res){


  if('POST'=== req.method) {
    var body = ''
    
    req.on('data', function(data) {
      body += data
    })

    req.on('end', function(end) {
      var parts = body.split('&')

      var document = {}
      parts.reduce(function(accumulator, keyValuePair){
        var pair = keyValuePair.split('=')
        accumulator[pair[0]]=pair[1]
        return accumulator
      },document)
      console.log(document)
      strings.insert(document, function(err, savedDoc){
        res.end(JSON.stringify(savedDoc))
      })
 
      // res.end(body)
    })
  } else if ('GET' === req.method) { 

    if(req.url === '/shapes') {

      strings.find({}, function(err, savedDoc) {
        // res.end(compiledGetAll(JSON.stringify({results: savedDoc})))
        res.end(compiledGetAll({results : savedDoc}))
      })
    }
    else if(req.url === '/shapes/new') {
    
        var document = {}

        var text = compiledPostNew({})
        //res.end(JSON.stringify(document))
        res.end(text)

    } else {

        var document = {}
        // v qar text = compiledGetNew({})
        //res.end(JSON.stringify(document))
        res.end('you really shouldnt be here')
    }
  }
}
        
var server = http.createServer(requesthandler)

server.listen(3000, function(){
  console.log("Server up and running you know the port")

})