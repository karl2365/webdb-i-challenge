const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());


server.get('/api/accounts', (req, res) => {
    const {limit, sortby, sortdir} = req.query;
    const query = db('accounts');
    
    if (sortby && (!sortdir || sortdir.toLowerCase() === 'asc')) {
        query.orderBy(sortby);
    }
    if (sortby && sortdir && sortdir.toLowerCase() === 'desc'){
        query.orderBy(sortby, sortdir);
    }
    if (limit){
        query.limit(limit);
    }
    query
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(err => {
            res.status(500).json({message: 'Error accessing the database!'})
        })
});

server.post('/api/accounts', (req, res) => {
    const adding = req.body;
    if(adding.name && adding.budget){
        db('accounts').insert(adding, 'id')
            .then(acct => {
                res.status(200).json(acct);
            })
            .catch(err => {
                res.status(500).json({error: 'Error adding record to database.'})
            })
    }
    else {
        res.status(400).json({error: 'You must include name and budget'})
    }
});

server.put('/api/accounts/:id', (req, res) => {
    const adding = req.body;
    if(adding.name && adding.budget){
        db('accounts').where('id', '=', req.params.id).update(adding)
            .then(count => {
                res.status(200).json(count);
            })
            .catch(err => {
                res.status(500).json({error: 'Error adding record to database.'})
            })
    }
    else {
        res.status(400).json({error: 'You must include name and budget'})
    }
})

server.delete('/api/accounts/:id', (req, res) => {
    db('accounts').where('id', '=', req.params.id).del()
    .then(count => {
        if (count > 0){
            res.status(200).json(count);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    })
    .catch(err => {
        res.status(500).json({error: 'Error adding record to database.'});
    });
});



module.exports = server;