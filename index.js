const express = require("express")
const app = express()
const axios = require("axios")
const bodyParser = require("body-parser")
const cors = require("cors")
const fs = require("fs")
const schedule = require("node-schedule")

// UTILS
const { getAllListElements } = require("./utils")

// CONSTANTS
const { FILE_NAME, PORT, URL } = require("./constants")

app.use(cors())
app.use(bodyParser.json())

app.get("/", async (_, res) => {
  fs.readFile(FILE_NAME, async (err, file) => {
    if (err) {
      const { data } = await axios.get(URL)
      if (data) {
        const items = getAllListElements(data)

        const dataToWrite = {
          items,
          lastUpdated: new Date(),
        }

        fs.writeFile(FILE_NAME, JSON.stringify(dataToWrite), (err) => {
          if (err) {
            console.log(err)
          }
        })
        return res.status(200).json({ items })
      }
    }
    return res.status(200).json(JSON.parse(file))
  })
})

// JOB
const job = schedule.scheduleJob("*/8 * * * *", async () => {
  const { data } = await axios.get(URL)
  const items = getAllListElements(data)

  const dataToWrite = {
    items,
    lastUpdated: new Date(),
  }

  fs.writeFile(FILE_NAME, JSON.stringify(dataToWrite), (err) => {
    if (err) {
      console.log(err)
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
