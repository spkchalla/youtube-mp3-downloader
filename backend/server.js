import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.get('/',(req, res)=>{
    res.send(`Server running at ${PORT}`);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Server started running at port ${PORT}`);
})
