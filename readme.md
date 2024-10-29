# Introduction

This is a script used for scraping BSK lab results given specific parameters using `puppeteer`.

# Description

HTML element ID's are static on the BSK client website, probably to allow for scraping or dynamic ID's are simply not a current need. Whatever the case, this makes it easy to automate the download of data and for an ETL pipeline.

As of now, this is scoped to allow for scraping of all data in the "General" section of the lab results. Once we have a more recent data set to test, this can be refactored to scrape only data uploaded in the last 30 days.