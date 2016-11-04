#_*_ coding: utf-8 _*_
import jieba
import codecs

f = codecs.open('weibocorpus.txt','r','utf-8')
corpus = f.read()
stopwords ={}.fromkeys([line.rstrip()  for line in open("zh_stopwords.txt",'r')])
segs = jieba.cut(corpus ,cut_all=False)
file = codecs.open('withoutstopwords.txt', 'a+', 'utf-8')
for n in segs:
    if n not in stopwords:
        file.write(n)
        file.write(' ')
