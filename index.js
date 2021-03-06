"use strict"
const db = require('./lib/db/db.js')

const express = require('express')
const path = require("path")
const app = express()

let util = require('./lib/db/util')
let bodyParser = require('body-parser')

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000))
/* This servers public/ as static, it will work
for now until we want to pass dynamic content */
app.use(express.static(path.join(__dirname + '/public')))

app.get('/example', async function(req, res) {
  let result = await db.consumptionById('735999114006943486')
  res.send(result)
})

app.get('/example2', async function(req, res) {
  let result = await db.infoById('735999114000793384')
  res.send(result)
})

app.get('/buildings', async function(req, res) {
  let result = await db.getAllBuildings()
  res.send(result)
})

app.get('/buildingsByAddress/:addr', async function(req, res) {
  let result = await db.getBuildingsByAddress(req.params.addr)
  res.send(result)
})

app.get('/buildingsByFuse/:fuse',async function(req,res){
  let result = await db.getBuildingsByFuse(req.params.fuse)
  res.send(result)
})

app.get('/consumptionById/:id',async function(req,res){
  let result = await db.getConsumptionById(req.params.id)
  res.send(result)
})

/**
* example usage:
* http://localhost:5000/consumptionOnIntervalById/735999114007366888/month
*
*/
app.get('/consumptionOnIntervalById/:id/:time', async function(req, res) {
  let result = await db.getConsumptionByDate(req.params.id, req.params.time)
  util.sendFormatted(res, result)
})

/**
* example usage:
* http://localhost:5000/consumptionOnIntervalById/735999114006943486/[year|month|day]/2008-01-01/2017-01-01
*
* If anything else but the parameters above are supplied for time the normal consumptionOnIntervalById will be returned
*/
app.get('/consumptionOnIntervalById/:id/:time/:from/:to', async function(req, res) {
  console.time('consumptionOnIntervalById with ' + req.params.time)
  let result = await db.getConsumptionByDate(req.params.id, req.params.time, req.params.from, req.params.to)
  util.sendFormatted(res, result)
  console.timeEnd('consumptionOnIntervalById with ' + req.params.time)
})

app.get('/maximumConsumptionOnIntervalById/:id/:from/:to/:time', async function(req, res) {
  let time = req.params.time
  let result = {}
  switch(time) {
    case 'month':
      result = await db.getMonthlyMaxConsumption(req.params.id, req.params.from, req.params.to, req.params.time)
      break
    case 'day':
      result = await db.getDailyMaxConsumption(req.params.id, req.params.from, req.params.to, req.params.time)
      break
    default:
      break
  }  
  util.sendFormatted(res, result)
})

app.get('/fuseCapacity/:id',async function(req,res){
  let result = constants.FUSES[req.params.id]
  res.send(result)
})

app.get('/hello', function(req, res) {
  res.send("Hello captain")
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port') + " [" + new Date().toLocaleString() + "]")
})
