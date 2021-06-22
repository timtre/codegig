const express = require('express');
const router = express.Router();
const db = require('../config/database')
const Gig = require('../models/Gig')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get gig list
router.get('/', (req, res) => {
    Gig.findAll()
        .then(gigs => {
            gigs_list = []
            for(item of gigs) {
                gigs_list.push(item['dataValues'])
            }
            res.render('gigs', {
                gigs_list
            });
        })
        .catch(err => console.log(err))
});

// Display add gig form
router.get('/add', (req, res) => {res.render('add')})

// Add a gig
router.post('/add', (req, res) => {
    let { title, technologies, budget, description, contact_email } = req.body;
    let errors = [];

    if(!title) {
        errors.push({ text: 'Please add a title' });
    }
    if(!technologies) {
        errors.push({ text: 'Please add some technologies' });
    }
    if(!description) {
        errors.push({ text: 'Please add a description' });
    }
    if(!contact_email) {
        errors.push({ text: 'Please add a contact email' });
    }

    // Check for errors
    if(errors.length > 0) {
        res.render('add', {
            errors: errors,
            title: title,
            technologies: technologies,
            budget: budget,
            description: description,
            contact_email: contact_email
        });
    } else {
        if(!budget) {
            budget = 'Unknown';
        } else {
            budget = `$${budget}`;
        }

        // Make lowercase and remove space after comma
        technologies = technologies.toLowerCase().replace(/, /g, ',')

        // Insert into table
        Gig.create({
            title,
            technologies,
            description,
            budget,
            contact_email
        })
            .then(gig => res.redirect('/gigs'))
            .catch(err => console.log(err));
        }
});

// Search for gigs
router.get('/search', (req, res) => {
    let { term } = req.query;
    term = term.toLowerCase();

    Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } }})
        .then(gigs => {
            gigs_list = []
            for(item of gigs) {
                gigs_list.push(item['dataValues'])
            }
            res.render('gigs', { gigs_list })
        })
        .catch(err => console.log(err));
});

module.exports = router;