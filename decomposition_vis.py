from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import pandas as pd

# read the user average vector
data = pd.read_csv('user_word_vector.csv',index_col=0)
# use PCA to decomposition
pca = PCA(n_components=2)
reduced_X = pca.fit_transform(data)
for i in reduced_X:
    plt.plot(i[0],i[1],'ro')
plt.show()


print(reduced_X.shape)