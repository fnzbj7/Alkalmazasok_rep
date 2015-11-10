var express = require('express');

var router = express.Router();

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

function decorateErrors(errorContainer,req) {
    return errorContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        e.logg = req.isAuthenticated();
        return e;
    });
}


//Elérések

//-----NEW-----
router.get('/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();

    res.render('todo/new', {
        validationErrors: validationErrors,
        data: data,
    });
});

router.post('/new', function (req, res) {
    // adatok ellenőrzése
    req.checkBody('helyszin', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    //console.log(validationErrors);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/todo/new');
    }else
    {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        req.app.models.todo.create({
            status: 'new',
            location: req.body.helyszin,
            description: req.body.leiras
        })
        .then(function (error) {
            //siker
            req.flash('info', 'Hibajegy sikeresen felvévek!');
            res.redirect('/todo/list');
        })
        .catch(function (err) {
            //hiba
            if(err){}
        });
    }
    
});

//-----LIST-------
router.get('/list', function (req, res) {
    req.app.models.todo.find().then(function (errors) {
        console.log(errors.logg);
        res.render('todo/list', {
            errors: decorateErrors(errors,req),
            messages: req.flash('info'),
        });
    });
});

router.post('/list/:id', function (req, res) {
    req.app.models.todo.destroy({id: req.params.id}).exec(function deleteCB(err){
        if(err){}
        });
    res.redirect('/todo/list');
});


//------UPDATE---------------
router.post('/list/update/:id', function (req, res) {
    //Ellenörzés
    req.checkBody('location', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('description').escape();
    req.checkBody('description', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/todo/list/update/'+req.body.id);
    }else
    {
       
        req.app.models.todo.update({id: req.body.id},{location: req.body.location, description: req.body.description}).exec(function afterwards(err, updated){
            req.flash('info', 'Sikeres votl a módosítás!');
            res.redirect('/todo/list');
          if (err) {
            // handle error here- e.g. `res.serverError(err);`
            return;
          }
        });
        
        /* adatok elmentése (ld. később) és a hibalista megjelenítése
        req.app.models.todo.create({
            status: 'new',
            location: req.body.helyszin,
            description: req.body.leiras
        })
        .then(function (error) {
            //siker
            req.flash('info', 'Hibajegy sikeresen felvévek!');
            res.redirect('/todo/list');
        })
        .catch(function (err) {
            //hiba
            if(err){}
        });*/
    }
    
});


router.get('/list/update/:id', function (req, res) {
    req.app.models.todo.findOne({id: req.params.id}).exec(function findOneCB(err, found){
        var validationErrors = (req.flash('validationErrors') || [{}]).pop();
        
        res.render('todo/update',{
                validationErrors: validationErrors,
                data: found});
        if(err){}
    });
});


module.exports = router;