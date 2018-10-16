from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import scrape_mars

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/mars_app"
mongo = PyMongo(app)


@app.route("/")
def index():
    marsdata = mongo.db.marsdata.find_one()
    return render_template("index.html", marsdata=marsdata)

@app.route("/scrape")
def scraper():
    mongo.db.marsdata.drop()
    results = scrape_mars.scrape()
    mongo.db.marsdata.insert_one(results)
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)