const express = require('express')
const axios = require("axios")
require("dotenv").config()
const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Treasure Hunt is ALIVE")
})

let incorrectCount = 1;
let correctCount = 1;

app.post("/solution", async (req, res) => {
    const timestamp = new Date().toISOString();
    const pName = req.body.pName;
    const response = req.body.response;
    if(!pName || !response)
        res.status(200).json({
            success: false,
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
                        value: `${timestamp}`,
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
                    timestamp: "2025-03-27T18:30:00.000Z"
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
        })
    }
    catch(err) {
        console.log(err)
        res.status(400).send({ error: "Something went wrong", success: false })
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Treasure Hunt Secret listening on port ${process.env.PORT}`)
})
