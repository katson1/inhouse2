# inhouse2
An in-house bot that choose 2 random captains, and allows them to pick players for [Heroes Of The Storm](https://heroesofthestorm.blizzard.com/pt-br/) custom games.

It operates with a lobby voice channel. Captains are randomly selected from the lobby channel and then they can pick players from the same channel.

Make sure to read about the commands before using them. You can also use the `/help` bot command to view all available commands and learn how to use them.


## ⌨️ Commands:

<details>
  <summary> /join </summary>
    
  - Join and register as a player in the inhouse.
  
    * options:
    
        - `rank:` select your current skill rank. (required)
        - `primary_role` - select your primary_role. (required)
        - `secondary_role` - select your secondary_role. (optional)
        
</details>

<details>
  <summary> /help </summary>
  
  - Display the commands descriptions.
</details>

<details>
  <summary> /config </summary>
  
  - This command configures the bot. You need to use it only once when you invite the bot to your server.
</details>

<details>
  <summary> /list </summary>
  
  - List players in the lobby channel who are not captains or already picked.
</details>

## 📦 How to install and invite the bot at your server:
You need to have [node.js](https://nodejs.org/en) installed.

Clone the project.

Install required packages into the project:
  ```bash
npm install
  ```

Now copy the .env.example file to **.env** file to the project:
  ```.bash
cp .env.example .env
  ```

Now, you need to create a bot in the [discord developer portal](https://discord.com/developers/applications).
Click on New Application and give it a cool name.
On the **General Information** tab copy the APPLICATION ID and past on the CLIENT_ID variable on .env file, like this example: 

  ```.env
TOKEN=
CLIENT_ID=0123456789876543210
  ```

Now, on the **Bot** tab, click on "Reset Token" to generate a new `Token`. 
Copy the `token` to the .env file:
> Remember, it's crucial not to share this token with anyone else.

The `.env` file should be like this example:
  ```.env
TOKEN=EXAMPLE01234TOKEN
CLIENT_ID=0123456789876543210
  ```

**THIS IS A VERY IMPORTANT STEP:**

On the 'OAuth2' tab, under the 'OAuth2 URL Generator' session, select **bot** and **applications.commands**. Then, in the 'BOT PERMISSIONS' section, check the **Administrator** checkbox. This will generate the link to add the bot to a server. Simply paste the generated link into your browser to add the bot to your server.

Now, run the command:
   ```js
npm start
  ```

The bot is now up and running! Head over to your server and enjoy it!

Notice: The bot may take up to 5 minutes to register the commands.

> ⚠️ This bot cannot operate on multiple servers simultaneously within the same project because the database only works for one server. If you use the bot on more than one server, the data will be messed up.
 
## Author:
<div align="left">
  <div>
    Katson Matheus
    <a href="https://github.com/katson1">
      <img src="https://skillicons.dev/icons?i=github" alt="html" height="15" />
    </a>
    <a href="https://discordapp.com/users/210789016675549184">
      <img src="https://skillicons.dev/icons?i=discord" alt="html" height="15"/>
    </a>
    <a href="https://www.linkedin.com/in/katsonmatheus/">
      <img src="https://skillicons.dev/icons?i=linkedin" alt="html" height="15"/>
    </a>
    <a href="mailto:katson.alves@ccc.ufcg.edu.br">
      <img src="https://skillicons.dev/icons?i=gmail" alt="html" height="15"/>
    </a>
  </div>
</div>
