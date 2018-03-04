
# coding: utf-8

# In[536]:

import pandas as pd
import numpy as np
import sqlite3 as lite
import sys
import time


# In[537]:

# load data

start_time = time.time()
#df = pd.read_csv('sample100.csv')
df = pd.read_csv('el_07_07_2017.csv')
#df.head()
print("--- %s seconds ---" % (time.time() - start_time))


# In[538]:

#stacked = df.unstack()
#stacked
# dt = df.transpose()
#df.pivot_table(index=df.iloc[:,0])
#pd.melt(dt, id_vars='date', value_vars=dt.iloc[:,1:])
#pd.melt(dt, id_vars=dt.iloc[0,:], value_vars='date')
#pd.melt(df, id_vars="date", value_vars=df.iloc[:,0])
start_time = time.time()
d = pd.melt(df, id_vars='date', value_vars=df.iloc[:,1:])
print("--- %s seconds ---" % (time.time() - start_time))


# In[539]:

# Read sqlite query results into a pandas DataFrame
start_time = time.time()
con = lite.connect("db.sqlite")
#df = pd.read_sql_query("SELECT * from consumption", con)
print("--- %s seconds ---" % (time.time() - start_time))


# In[540]:

# drop data into database
start_time = time.time()
d.to_sql("YunusTableAllData1", con, if_exists="replace")
print("--- %s seconds ---" % (time.time() - start_time))


# In[541]:

start_time = time.time()
d = pd.read_sql_query("SELECT * from YunusTableAllData1", con)
print("--- %s seconds ---" % (time.time() - start_time))


# In[542]:

# Verify that result of SQL query is stored in the dataframe
start_time = time.time()
print(d.head())
print("--- %s seconds ---" % (time.time() - start_time))


# In[543]:

start_time = time.time()
con.close()
print("--- %s seconds ---" % (time.time() - start_time))


# In[ ]:




# In[ ]:



