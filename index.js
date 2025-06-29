// const express = require('express');
// const mongoose = require('mongoose');
// var cors = require('cors');

// const app = express();
// const port = 5000;
// app.use(cors());
// app.use(express.json());

// const uri = 'mongodb+srv://SigmaMS:Sigma%40123@cluster0.gsa79xn.mongodb.net/';
// mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
// const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log('MongoDB connection established successfully!!!')
// });

// const customerRouter = require('./routes/customers');



// app.use('/health-user', customerRouter);


// app.use(cors({
//     origin: 'http://localhost:3000'
//   }));
  
//   // Other middleware and routes...
  
  
// app.listen(port, () => {
//     console.log(`Server is running on port:${port}`);
    
// })

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());
// const customerRouter = require('./routes/customers');
mongoose.connect('mongodb+srv://anupdhoble15:VBxkevAcmzBnvywy@cluster0.niaty5l.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.error(error);
});

app.use('/api/auth', require('./routes/auth'));
// app.use('/customers', customerRouter);
app.use('/api/papers', require('./routes/paper'));

app.use('/api/student', require('./routes/student'));

app.use('/api/knowledge', require('./routes/knowledge'));

const PORT = process.env.PORT || 8000;


app.use(cors({
    origin: 'http://localhost:3000'
  }));
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
