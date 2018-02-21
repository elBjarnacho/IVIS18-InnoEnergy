# IVIS18-InnoEnergy
A group project in the course Information Visualization, where the goal is to provide useful visualization of data for the company InnoEnergy

## Installing

Make sure you have [Node.js](http://nodejs.org/) installed on your computer.

You can verify that you do by typing in the terminal:

```sh
npm --version
```

You should see something similar to

```sh
5.6.0
```

## Running

Read the rest of this document before you start pasting code.

```sh
git clone git@github.com:elBjarnacho/IVIS18-InnoEnergy.git # if you haven't got the project on disk
cd IVIS18-InnoEnergy # navigate to the folder that was just created
npm install # this installs dependencies
# !IMPORTANT Now you need to move the data file to the folder named 'secret'
npm start # launches the webserver, it's reachable in the browser as long as the process is alive.
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Building the database

When building the database you need to make sure that you have placed the relavant
files in the "secret" folder, i.e. one csv file for consumption data and one csv
file for additional information on buildings (use the name building_info.csv when
saving the file). 

If the database hasn't been built already it will do so automatically.
The database file will also be located in the "secret" folder.
Currently this process is slow. There are 48000x1000 fields.

There is a script for creating smaller samples in the scripts folder.

sample500.csv took about 30 seconds with the new speed improvements. That makes the big boss about 32 minutes.

Read the file ``` makeSamples.sh ``` for the complete instructions.
```sh
cd scripts
bash makeSamples.sh
```

You can rebuild the database with the command:

```sh
npm test
```


## Visualization with backend

```sh
get checkout feature/geomap
npm start
```
Go to [localhost:5000/map](http://localhost:5000/map),type ID and you'll see the
consumption over time.
