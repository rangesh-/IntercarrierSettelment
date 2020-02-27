const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/cdrdispute/:op', (req, res) => {
    var operator=req.params.op
    const nano = require('nano')('http://52.90.135.137:5984/');
    const db = nano.db.use('mychannel_cdr');
    const q = {
        selector: {
            DOCType: { "$eq": "CDR_DISPUTE"},
            Operator : { "$eq": operator }
        }       
      };
      console.log(q);
      db.find(q).then((doc) => {
        res.send(doc);
      });
    
})

app.get('/cdrdispute/:op/:date', (req, res) => {
    var operator=req.params.op
    var date=req.params.date
    const nano = require('nano')('http://52.90.135.137:5984/');
    const db = nano.db.use('mychannel_cdr');
    const q = {
        selector: {
            DOCType: { "$eq": "CDR_DISPUTE"},
            Operator : { "$eq": operator },
            LoadDate:{"$eq":date}
        }       
      };
      console.log(q);
      db.find(q).then((doc) => {
        res.send(doc);
      });
    
})
app.get('/cdrreport/:op', (req, res) => {
    var operator=req.params.op
    const nano = require('nano')('http://52.90.135.137:5984/');
    const db = nano.db.use('mychannel_cdr');
    const q = {
        selector: {
            DOCTYPE: { "$eq": "REPORT"},
            Operator : { "$eq": operator }
        }       
      };
      console.log(q);
      db.find(q).then((doc) => {
        res.send(doc);
      });
    
})
app.get('/cdrreport/:op/:date', (req, res) => {
    var operator=req.params.op
    var date=req.params.date
    const nano = require('nano')('http://52.90.135.137:5984/');
    const db = nano.db.use('mychannel_cdr');
    const q = {
        selector: {
            DOCTYPE: { "$eq": "REPORT"},
            Operator : { "$eq": operator },
            LoadDate:{"$eq":date}
        }       
      };
      console.log(q);
      db.find(q).then((doc) => {
        res.send(doc);
      });
    
})
app.get('/cdrreport/month/:op/:month', (req, res) => {
    var operator=req.params.op
    var month=req.params.month
    const nano = require('nano')('http://52.90.135.137:5984/');
    const db = nano.db.use('mychannel_cdr');
    const q = {
        selector: {
            DOCTYPE: { "$eq": "REPORT"},
            Operator : { "$eq": operator },
            Month:{"$eq":month}
        }       
      };
      console.log(q);
      db.find(q).then((doc) => {
        res.send(doc);
      });
    
})

app.post('/batch', (req, res) => {
    var opurl=req.query.op
    var opname=req.query.name 
    console.log(opurl)       
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))