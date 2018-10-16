import os
from bs4 import BeautifulSoup
import requests
import pandas
from splinter import Browser
import time
import shutil
import re


def scrape():

    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=False)

    marsdata = {}

    url = 'https://mars.nasa.gov/news/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Print Title
    news_title = soup.title.text
    
    # Print all paragraph texts
    paragraphs = soup.find_all('p')
    for paragraph in paragraphs:
        print(paragraph.text)
    news_p = paragraph.text
    
    # add our last news and last paraghraph to to Marse_data 
    marsdata["news_title"] = news_title
    marsdata["news_p"] = news_p
    
    #Mars Image
    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url)
    full_image = browser.find_by_id('full_image')
    full_image.click()

    browser.is_element_present_by_text('more info', wait_time=3)
    info = browser.find_link_by_partial_text('more info')
    info.click()

    html =  browser.html

    img = BeautifulSoup(html, 'html.parser')

    marsdata["featured_image_url"] = img.select_one('figure.lede a img').get('src')
    
    # Mars Weather
    mars_weather=soup.find(string=re.compile("Sol"))
    marsdata["mars_weather"] = mars_weather
    
    # Space Facts
    url = 'https://space-facts.com/mars/'
    browser.visit(url)
    for i in browser.find_by_tag('td'):
        i.text
    head = []
    data = []
    for r in range(len(browser.find_by_tag('td'))):
        if r % 2 == 0:
            head.append(browser.find_by_tag('td')[r].text)
        else:
            data.append(browser.find_by_tag('td')[r].text)
    mars_facts = list(zip(head,data))
    marsdata["Mars_facts"] = mars_facts

    # Mars Hemispheres
    url='https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(url)
    links = ['Cerberus', 'Schiaparelli', 'Syrtis' , 'Valles']
    hemisphere_image_urls=[]
    links = ['Cerberus', 'Schiaparelli', 'Syrtis' , 'Valles']
    hemisphere_image_urls=[]
    for link in links:
        hemisphere_image_urls_dic={}
        link_click = browser.find_link_by_partial_text(link)
        link_click.click()
        time.sleep(15)
    # `   browser.is_element_present_by_css("img.wide-image", wait_time=10)
        html = browser.html
        soup = BeautifulSoup(html, 'html.parser')
        image_url=soup.find("img",class_="wide-image")["src"]
        title=soup.find("h2",class_="title").text
        if "https://astrogeology.usgs.gov:" not in image_url: image_url = "https://astrogeology.usgs.gov"+image_url
        hemisphere_image_urls_dic['title'] = title
        hemisphere_image_urls_dic['image_url']=image_url
        hemisphere_image_urls.append(hemisphere_image_urls_dic)
        browser.back()
        marsdata["hemisphere_title_urls"] = hemisphere_image_urls     
        browser.quit()
        return marsdata



