# -*- coding: utf-8 -*-
from gensim.models import word2vec
import numpy as np
from pymongo import MongoClient
import pandas as pd
model = word2vec.Word2Vec.load('words.model')
###################
#y2 = model.most_similar("书", topn=20)  # 20个最相关的
#print("和【书】最相关的词有：\n")
#for item in y2:
#    print(item[0], item[1])
#print("--------\n")
###################

def getAvgFeatureVecs(reviews, model, num_features):
    # Given a set of reviews (each one a list of words), calculate
    # the average feature vector for each one and return a 2D numpy array
    #
    # Initialize a counter
    counter = 0.
    #
    # Preallocate a 2D numpy array, for speed
    reviewFeatureVecs = np.zeros((len(reviews), num_features), dtype="float32")
    #
    # Loop through the reviews
    for review in reviews:

        if counter==64:
            print(review)
        #
        # Print a status message every 1000th review
        if counter % 1000. == 0.:
            print("Review %d of %d" % (counter, len(reviews)))
        #
        # Call the function (defined above) that makes average feature vectors
        reviewFeatureVecs[counter] = makeFeatureVec(review, model, num_features)
        #
        # Increment the counter
        counter = counter + 1.
    return reviewFeatureVecs
def makeFeatureVec(words, model, num_features):
    # Function to average all of the word vectors in a given
    # paragraph
    #
    # Pre-initialize an empty numpy array (for speed)
    featureVec = np.zeros((num_features,), dtype="float32")
    #
    nwords = 0.
    #
    # Index2word is a list that contains the names of the words in
    # the model's vocabulary. Convert it to a set, for speed
    index2word_set = set(model.index2word)
    #
    # Loop over each word in the review and, if it is in the model's
    # vocaublary, add its feature vector to the total
    for word in words:
        if word in index2word_set:
            nwords = nwords + 1.
            featureVec = np.add(featureVec, model[word])
    #
    # Divide the result by the number of words to get the average
    featureVec = np.divide(featureVec, nwords)
    return featureVec
def get_user_weibos():
    filename = "userlist.txt"
    def get_userlist(filename):
        with open(filename, 'r') as userfile:
            lines = userfile.readlines()
            user_ids = []
            user_names = []
            for i, line in enumerate(lines):
                    user_ids.append(line.strip())
            #
            #for user_id, user_name in zip(user_ids, user_names):
            #    user_names_map[int(user_id)] = user_name
            return user_ids
    user_ids= get_userlist(filename)
    client = MongoClient("mongodb://10.76.3.86:27017")
    db = client['weibo']
    coll = db['raw_data']
    cur = coll.find()
    user_weibos = {}
    for weibo in cur:
        if int(weibo['created_at'].split("-")[0]) not in [2012, 2013, 2014]:
            continue
        user_id = weibo['user_id']
        user_weibos[user_id] = user_weibos.get(user_id, "") +" "+weibo['text']
    user_ids = []
    #user_names = []
    user_texts = []
    for key, text in user_weibos.items():
        #print key, text
        #user_name = user_names_map[user_id]
        user_ids.append(key)
        #user_names.append(user_name)
        user_texts.append(text)

    user_data = pd.DataFrame(data={"user_id": user_ids, "text": user_texts})
    return user_data
###############
# get the user's weibo
user_data = get_user_weibos()
# get average vectors as the users
DataVecs = getAvgFeatureVecs(user_data["text"], model, 200)
# save into the file
pd_dv = pd.DataFrame(data=DataVecs, index=user_data['user_id'])
pd_dv.to_csv("user_word_vector.csv")

#print(model.index2word)
###############