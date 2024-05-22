const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const userDatabase = {};

const verifyAuthenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const authToken = authHeader && authHeader.split(' ')[1];
    
    if (authToken == null) return res.sendStatus(401);
    
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
        if (err) return res.sendStatus(403);
        req.user = decodedUser;
        next();
    });
};

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (userDatabase[username]) {
            return res.status(400).send('User already exists');
        }
        
        userDatabase[username] = { password: hashedPassword };
        
        res.status(201).send('User registered successfully');
    } catch {
        res.status(500).send();
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userInDb = userDatabase[username];
    
    if (userInDb == null) {
        return res.status(400).send('Cannot find user');
    }
    
    try {
        if (await bcrypt.compare(password, userInDb.password)) {
            const accessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken });
        } else {
            res.send('Login failed');
        }
    } catch {
        res.status(500).send();
    }
});

app.get('/protected', verifyAuthenticationToken, (req, res) => {
    res.send('Welcome to the protected route, ' + req.user.username);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});