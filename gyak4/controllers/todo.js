var express = require('express');

var app = express.Router();

//Model layer
var errorContainer = [];


//Viewmodel réteg
var statusTexts = {
    'new': 'Új',
    'assigned': 'Hozzárendelve',
    'ready': 'Kész',
    'rejected': 'Elutasítva',
    'pending': 'Felfüggesztve',
};
var statusClasses = {
    'new': 'danger',
    'assigned': 'info',
    'ready': 'success',
    'rejected': 'default',
    'pending': 'warning',
};

function decorateErrors(errorContainer) {
    return errorContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}


//Elérések
app.get('/new', function (req, res) {
    
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();

    res.render('todo/new', {
    validationErrors: validationErrors,
    data: data,
});
});

app.post('/new', function (req, res) {
    // adatok ellenőrzése
    req.checkBody('helyszin', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/todo/new');
    }
    else {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        req.flash('info', 'Hiba sikeresen felvéve!');
        errorContainer.push({
            date: (new Date()).toLocaleString(),
            status: 'new',
            location: req.body.helyszin,
            description: req.body.leiras,
            numberOfMessages: 0
        });
        res.redirect('/todo/list');
    }
});

app.get('/list', function (req, res) {
    res.render('todo/list', {
        errors: decorateErrors(errorContainer),
        messages: req.flash('info'),
    });
});


module.exports = app;