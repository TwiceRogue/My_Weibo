import pymongo
import json
import codecs

client = pymongo.MongoClient('10.76.3.86',27017)
f = codecs.open("weibocorpus.txt","a+",'utf-8')
db = client.weibo
collection = db.raw_data
ent = '\n'
print(collection)
dic = {}
i = collection.find()
count = 0
for obj in i:
    f.write(obj['text'])
    f.write(ent)
    count += 1
print(count)