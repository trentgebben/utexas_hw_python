{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [
    {
     "ename": "ModuleNotFoundError",
     "evalue": "No module named 'mission_to_mars'",
     "output_type": "error",
     "traceback": [
      "\u001b[1;31m---------------------------------------------------------------------------\u001b[0m",
      "\u001b[1;31mModuleNotFoundError\u001b[0m                       Traceback (most recent call last)",
      "\u001b[1;32m<ipython-input-1-8f66339362dd>\u001b[0m in \u001b[0;36m<module>\u001b[1;34m()\u001b[0m\n\u001b[0;32m      1\u001b[0m \u001b[1;32mfrom\u001b[0m \u001b[0mflask\u001b[0m \u001b[1;32mimport\u001b[0m \u001b[0mFlask\u001b[0m\u001b[1;33m,\u001b[0m \u001b[0mrender_template\u001b[0m\u001b[1;33m,\u001b[0m \u001b[0mredirect\u001b[0m\u001b[1;33m,\u001b[0m \u001b[0mjsonify\u001b[0m\u001b[1;33m\u001b[0m\u001b[0m\n\u001b[0;32m      2\u001b[0m \u001b[1;32mfrom\u001b[0m \u001b[0mflask_pymongo\u001b[0m \u001b[1;32mimport\u001b[0m \u001b[0mPyMongo\u001b[0m\u001b[1;33m\u001b[0m\u001b[0m\n\u001b[1;32m----> 3\u001b[1;33m \u001b[1;32mimport\u001b[0m \u001b[0mmission_to_mars\u001b[0m\u001b[1;33m\u001b[0m\u001b[0m\n\u001b[0m",
      "\u001b[1;31mModuleNotFoundError\u001b[0m: No module named 'mission_to_mars'"
     ]
    }
   ],
   "source": [
    "from flask import Flask, render_template, redirect, jsonify\n",
    "from flask_pymongo import PyMongo\n",
    "import mission_to_mars"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "app = Flask(__name__)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Use flask_pymongo to set up mongo connection\n",
    "app.config[\"MONGO_URI\"] = \"mongodb://localhost:27017/mars_app\"\n",
    "mongo = PyMongo(app)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "@app.route(\"/\")\n",
    "def index():\n",
    "    marsdata = mongo.db.marsdata.find_one()\n",
    "    return render_template(\"index.html\", marsdata=marsdata)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "@app.route(\"/scrape\")\n",
    "def scraper():\n",
    "    mongo.db.marsdata.drop()\n",
    "    results = scrape_mars.scrape()\n",
    "    mongo.db.marsdata.insert_one(results)\n",
    "    return redirect(\"/\", code=302)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "if __name__ == \"__main__\":\n",
    "    app.run(debug=True)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python (pythondata)",
   "language": "python",
   "name": "pythondata"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.6.5"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}