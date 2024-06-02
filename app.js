const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
app.use(express.json());

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/comments', require('./routes/comments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));