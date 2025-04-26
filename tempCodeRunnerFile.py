# FINAL FIRE PREDICTION MODEL 🔥

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
from sklearn import tree

# 1. Read the data
df = pd.read_csv('forestfires.csv')

# 2. Log transform 'area'
df['area'] = df['area'].apply(lambda x: np.log1p(x))  # log(1+x)

# 3. Create size_category
df['size_category'] = df['area'].apply(lambda x: 'small' if x < np.log1p(5) else 'large')

# 4. Features
features = ['FFMC', 'DMC', 'DC', 'ISI', 'temp', 'RH', 'wind', 'rain']
X = df[features]
y = df['size_category']

# 5. Normalize the features
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# 6. Split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# 7. Define the model
model = ExtraTreesClassifier(
    n_estimators=300,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    max_features='sqrt',
    random_state=42
)

# 8. Train
model.fit(X_train, y_train)

# 9. Predict + Evaluate
y_pred = model.predict(X_test)
final_accuracy = accuracy_score(y_test, y_pred)

print(f"Final Test Set Accuracy: {round(final_accuracy, 4) * 100}%")

# 10. Plot one tree from the forest
plt.figure(figsize=(20,10))
tree.plot_tree(model.estimators_[0], filled=True, feature_names=features, class_names=["small", "large"])
plt.show()
