const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB 연결
mongoose.connect('mongodb://<your-mongo-uri>', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User 스키마 정의
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// Message 스키마 정의
const MessageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    text: { type: String, required: true },
});
const Message = mongoose.model('Message', MessageSchema);

// 회원가입
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User created');
});

// 로그인
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
});

// 메시지 저장
app.post('/messages', async (req, res) => {
    const { user, text } = req.body;
    const message = new Message({ user, text });
    await message.save();
    res.status(201).send('Message saved');
});

// 메시지 가져오기
app.get('/messages', async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
