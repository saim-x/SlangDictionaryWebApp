// Inside index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/dictionary', { useNewUrlParser: true, useUnifiedTopology: true });

const wordSchema = new mongoose.Schema({
    name: String,
    definition: String,
});

const Word = mongoose.model('Word', wordSchema);

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/words', async (req, res) => {
    try {
        let query = {};
        const searchTerm = req.query.search;
        const limit = parseInt(req.query.limit) || 10;  
        const page = parseInt(req.query.page) || 1; 
        const skip = (page - 1) * limit;

        if (searchTerm) {
            query = {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { definition: { $regex: searchTerm, $options: 'i' } },
                ],
            };
        }
        const words = await Word.find(query).skip(skip).limit(limit);
        res.json(words);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/words', async (req, res) => {
    try {
        await Word.deleteMany({});

        const newWords = req.body;

        if (!newWords || newWords.length === 0) {
            return res.status(400).json({ error: 'New words array is required' });
        }

        const insertedWords = await Word.insertMany(newWords);

        res.status(201).json(insertedWords);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// app.post('/api/words', async (req, res) => {
//     try {
//         const { name, definition } = req.body;

//         if (!name || !definition) {
//             return res.status(400).json({ error: 'Name and definition are required' });
//         }

//         const newWord = new Word({ name, definition });
//         await newWord.save();

//         res.status(201).json(newWord);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
