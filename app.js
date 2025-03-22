const express = require("express")
const cors = require("cors")
const axios = require("axios")
require("dotenv").config()
const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    console.log("lemme spam 'em logs")
    res.sendFile(__dirname + "/index.html")
})

let incorrectCount = 1;
let correctCount = 1;

app.post("/solution", async (req, res) => {
    const timestamp = new Date().toISOString();
    const pName = req.body.pName;
    const response = req.body.response;
    console.log(req.body)
    if(!pName || !response)
        return res.json({
            success: false,
            errMsg: "Player Name or Answer is blank",
        })

    const accuracy = response.toLowerCase() == process.env.TH_SOLUTION;

    try {
        await axios.post(process.env.WEBHOOK_URL,
            {
                username: "Kalicharan",
                avatar_url: "https://hrishik-koley.github.io/images/profile2.jpeg",
                content: null,
                "embeds": [
                    {
                    title: `${accuracy ? "Correct" : "Incorrect"} Result ${accuracy ? correctCount : incorrectCount}`,
                    description: accuracy ? "Womp womp" : "Hooray!",
                    color: accuracy ? 0x00ff00 : 0xff0000,
                    fields: [
                        {
                        name: "Player Name",
                        value: `${pName}`,
                        inline: true
                        },
                        {
                        name: "Timestamp",
                        value: `<t:${Math.floor(new Date(timestamp).getTime() / 1000)}:F>`,
                        inline: true
                        },
                        {
                        name: "Response",
                        value: `**${response}**`,
                        inline: true
                        }
                    ],
                    author: {
                        name: "Who tf is this",
                        icon_url: "https://hrishik-koley.github.io/images/profile2.jpeg"
                    },
                    footer: {
                        text: "Brought to you by Treasure Hunting Madmen"
                    },
                    timestamp: timestamp,
                    }
                ],
                "attachments": []
            },
            {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if(accuracy)
            correctCount++;
        else
            incorrectCount++;

        res.status(200).json({
            success: true,
            isCorrect: accuracy,
        })
    }
    catch(err) {
        console.log(err)
        res.status(400).send({ success: false, errMsg: err.msg })
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Treasure Hunt Secret listening on port ${process.env.PORT}`)
})
