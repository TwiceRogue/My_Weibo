# -*- coding: utf-8 -*-
from gensim.models import Word2Vec
import sys
import importlib



model = Word2Vec.load_word2vec_format('words.model',binary=False)
y2 = model.most_similar("书", topn=20)  # 20个最相关的
print("和【书】最相关的词有：\n")
for item in y2:
    print(item[0], item[1])
print("--------\n")
