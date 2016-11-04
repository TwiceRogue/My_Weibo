import re
import codecs
import chardet
content = codecs.open('weibocorpus.txt', 'r', 'utf-8').read()                           #打开休要整理的文档，获得句柄#print chardet.detect(content)
                                                                        #我所有需要整理的文档都是utf-8进行编码的，如果不知道的话，大家用chardet工具。
                                    #python中的中文编码就是一个烦心事，最好的解决方法就是全部转化成unicode编码（python内部编码方式）
punct = codecs.open('zh_stopwords.txt', 'r').read()                             #  #这是中文标点符号集：排列格式如下图
punctuation = list()
for line in punct:
    word = line.strip('/r/n')                                           #出去换行符，注意是/r/n
    #word = word.decode('utf-8')                                         #当然标点符号也需要转换成unicode格式
    punctuation.append(word)
file = codecs.open('withoutstopwords.txt', 'a+','utf-8')             #推荐大家使用codecs来打开文档，设置编码方式很方便
string = re.sub("[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+", " ",content)
file.write(string)
