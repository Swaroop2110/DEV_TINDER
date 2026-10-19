const express = require('express');
const connectdb = require('./config/database');
const app = express();
const User = require('./models/user');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.get('/users', async (req, res) => {
    const email = req.body.emailID;
    try {
        const users = await User.find({ emailID: email });
        if (!users || users.length === 0) {
            return res.status(404).send('User not found');
        }
        return res.send(users);
    } catch (err) {
        return res.status(400).send('Error occurred while fetching user: ' + err.message);
    }
});

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find();
        return res.send(users);
    } catch (err) {
        return res.status(400).send('Error occurred while fetching users: ' + err.message);
    }
});

app.delete('/users', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.send('User deleted successfully');
    } catch (err) {
        return res.status(400).send('Error occurred while deleting user: ' + err.message);
    }
});

app.patch('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];
        const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));

        if (!isUpdateAllowed) {
            throw new Error('Invalid updates');
        }

        if (Array.isArray(data.skills) && data.skills.length > 10) {
            throw new Error('Skills cannot be more than 10');
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        console.log(user);
        return res.send('User details updated successfully');
    } catch (err) {
        return res.status(400).send('Error occurred while updating user: ' + err.message);
    }
});

app.use('/auth', authRouter);
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

const startServer = async () => {
    try {
        await connectdb();
        console.log('Database connected successfully');
        app.listen(3000, () => {
            console.log('SERVER IS SUCCESSFULLY LISTENING');
        });
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exitCode = 1;
    }
};

startServer();
