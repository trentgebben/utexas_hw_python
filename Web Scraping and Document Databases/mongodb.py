#imports
import pymongo
from  Scrape_data import MissionMars
from  datetime import datetime
from bson.objectid import ObjectId
import json

class MissionMarsDB:

    def __init__(self):
        # Create connection variable
        self.conn = 'mongodb://localhost:27017'

        # Pass connection to the pymongo instance.
        self.client = pymongo.MongoClient(self.conn)

        # Connect to a database. Will create one if not already available.
        self.db = self.client.mission_mars_db

        # Drops collection if available to remove duplicates
        # self.db.mission_mars.drop()
        def __del__(self):
            self.client.close()

    def insert_data(self):
        """Insert the data once a day.
        Returns True if new data to scrape
        -------
        """

        start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        end = datetime.now().replace(hour=23, minute=59, second=59)
        query = {'create_date': {'$lt': end, '$gte': start}}

        result = self.db.mission_mars.find_one(query)
        #print(result)

        if self.db.mission_mars.find_one(query):
            return False
        else:
            # Srape the data
            missonmars = MissionMars("chrome")
            news_title, news_p = missonmars.get_headline("https://mars.nasa.gov/news")
            featured_image_url = missonmars.get_featured_image_url("https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars%20%22%22%22Get%20the%20featured%20image")
            mars_weather = missonmars.get_mars_weather("https://twitter.com/marswxreport?lang=en")
            mars_facts_df = missonmars.get_mars_facts("https://space-facts.com/mars/")
            hemisphere_image_urls = missonmars.get_mars_hemispheres("https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars")
            #missonmars.delete()

            # print(news_title)
            # print(news_p)
            # print(featured_image_url)
            # print(mars_weather)
            # print(mars_facts_df)
            # records = mars_facts_df.to_dict()
            # print(records['Value'])
            #print(hemisphere_image_urls)
            ###################################################################

            self.db.mission_mars.insert(
                        {'news_title': news_title,
                         'news_P': news_p,
                         'featured_image_url': featured_image_url,
                         'mars_weather': mars_weather,
                         'mars_facts_df' : mars_facts_df.to_dict()['Value'],
                         'hemisphere_image_urls': hemisphere_image_urls,
                         'create_date' : datetime.now()
                        })
        return True


    def find_top_1(self):
        """If found return latest 1 record.
        Returns nothing
        -------
        """
        sort = [('_id', -1)]
        result = self.db.mission_mars.find().sort(sort)
        if result.count():
            return result[0]

        return None