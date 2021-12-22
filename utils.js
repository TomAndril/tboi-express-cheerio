const cheerio = require("cheerio")

function generateMetas(meta) {
  const metaTypes = ["Type", "Item Pool", "Recharge time"]
  const type = metaTypes.find((type) => meta.includes(type))

  return {
    [type]: meta.replace(type, "").trim(),
  }
}

function getAllListElements(data) {
  const $ = cheerio.load(data)

  const items = []

  $(".main", data).each((_, el) => {
    $(el)
      .find("li")
      .each((_, item) => {
        const title = $(item).find(".item-title").text()
        const id = parseInt(
          $(item).find(".r-itemid").text().replace("ItemID: ", "")
        )
        const ingameTitle = $(item).find(".pickup").text()
        const quality = parseInt(
          $(item).find(".quality").text().replace("Quality:", "")
        )

        const descriptions = []
        $(item)
          .find(".quality")
          .nextUntil("ul")
          .each((_, desc) => {
            const description = $(desc).text()
            descriptions.push(description)
          })

        let metas = {}
        $(item)
          .find("ul")
          .children("p")
          .each((_, meta) => {
            const metaText = $(meta).text()
            metas = { ...generateMetas(metaText), ...metas }
          })

        items.push({
          title,
          id,
          ingameTitle,
          quality,
          descriptions,
          metas,
        })
      })
  })
  return items
}

module.exports = { getAllListElements }
