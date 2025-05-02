const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Mock user data
const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'user1', password: 'pass123' },
    { username: 'user2', password: 'pass456' }
];

// Mock citizen data
const citizens = [
    { citizenId: '123456789', policyNumber: 'POL-001' },
    { citizenId: '987654321', policyNumber: 'POL-002' },
    { citizenId: '456789123', policyNumber: 'POL-003' }
];

// Routes
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/search');
    } else {
        res.render('login');
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/search');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

app.get('/search', (req, res) => {
    if (!req.session.loggedin) {
        return res.redirect('/');
    }
    res.render('search', { policyNumber: null });
});

app.post('/search', (req, res) => {
    if (!req.session.loggedin) {
        return res.redirect('/');
    }
    
    const { citizenId } = req.body;
    const citizen = citizens.find(c => c.citizenId === citizenId);
    
    res.render('search', { 
        policyNumber: citizen ? citizen.policyNumber : 'Not found',
        citizenId: citizenId
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 