# New York Times Science News Scraper
### https://nyt-mongo-scrape.herokuapp.com/

#### Built with: Node.js, MongoDB, Javascript/Jquery & Bootstrap

## Description

This is a node.js application that lets users view and leave comments on the latest news. It reached out to the NYTimes Science webpage (http://nytimes.com/section/science) and scrapes the latest article's headline, summary, image & URL and displays them in a bootstrap card. The articles are stored in a mongo database and are scraped using axios and cheerio. The routes are configured using express. Morgan is also configured for logging.

Next steps: 
- Work on overall display, come up with color pallette and apply across all pages.
- Reach out to other science news sources and scrap those sources as well
