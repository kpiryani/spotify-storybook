# Spotify Storybook

## Welcome to this music production! :)

This project takes in a JSON file with basic playlist information, and writes 3 acts based on the name and the playlist information to give a timeline of how music taste has evolved over time.

# How to Run

### Step 1: Navigate to the folder "spotify-storybook/src"

    cd spotify-storybook/src


### Step 2: Open the file "json-retrieval.py"  
Inside the file, find the line that sets the playlist name and replace it with the name of the playlist you want to generate acts for.
        

### Step 3: Execute the following command to retrieve the raw playlist information in a JSON. 

    python json-retrieval.py
Login to Spotify if a pop-up comes up. This file will automatically saved in the data folder and will also be shown on the screen to show you the tracks!



### Step 4: Generating the Acts
After the test data appears inside the "data" folder, run this command from the same directory:

    python main.py
If everything works correctly, you will see a success message, and the folder "output" will contain the files with the generated Acts information!



