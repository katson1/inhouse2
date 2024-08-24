# inhouse2
A [Discord](https://discord.com/) bot designed to manage custom games in [Heroes Of The Storm](https://heroesofthestorm.blizzard.com/pt-br/)

It operates with a lobby voice channel. Captains can be selected automatically or manually from the lobby channel and they can pick players from the same channel.

Make sure to read about the commands before using them. You can also use the `/help` bot command to view all available commands and learn how to use them.

 [Click here to watch a clip of the bot being used on a twitch live (in Portuguese-BR).](https://clips.twitch.tv/DignifiedGeniusGaragePermaSmug-qUMPGc24I527joQd)

> this project is based on a simpler bot I had created before: [inhousebot](https://github.com/katson1/inhousebot)

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

<details>
  <summary> /captains </summary>
  
  - Choose two random captains from lobby channel.
</details>

<details>
  <summary> /pick </summary>
  
  - A captain can pick a player from the lobby channel who is not a captain or already picked.
</details>

<details>
  <summary> /clear </summary>
  
  - Clear teams and captains.
</details>

<details>
  <summary> /redraft </summary>
  
  - Clear teams but keep captains.
</details>

<details>
  <summary> /win </summary>
  
- Select winner team.
You earn `15 MMR` points per win.
  - If the team you defeated has 20% or more **MMR** than you, you receive `17 MMR` points.
  - If the team you defeated has 10% to 20% more **MMR** than you, you receive `16 MMR` points.
  
    **`The opposite occurs if you lose.`**
  
  - If you have `2500 MMR` points or more, you will receive `1 MMR` point less.
  - If you have `2300 MMR` points or more, you will receive `2 MMR` points less.
  - If you have `1800 MMR` points or less, you will receive `1 MMR` point more.
  - If you have `1700 MMR` points or less, you will receive `2 MMR` points more.
</details>

<details>
  <summary> /leaderboard </summary>
  
  - Shows players leaderboard based on MMR.
</details>

<details>
  <summary> /myrank </summary>
  
  - Shows your leaderboard position based on MMR.
</details>

<details>
  <summary> /achievements </summary>
    
  - List the achievements, or shows achievements of a player.
  
    * options:
        - `player` - select a player to show it achievements. (optional)
        
</details>

<details>
  <summary> /roles </summary>
  
  - Display your current roles, or allows you to update your roles by selecting new options:
    - If you set only primary_role, it will update the primary_role and erase secondary_role.
    - If you set both primary_role and secondary_role, it will update both.
    - If you set only secondary_role it will update only secondary_role.
    - If you dosnt set any, it will show your currents roles.
   
  * options:
  
      - `rank:` select your current skill rank. (required)
      - `primary_role` - select your primary_role. (required)
      - `secondary_role` - select your secondary_role. (optional)
</details>

<details>
  <summary> /map </summary>
  
  - Choose a random map to vote on and play!
</details>

<details>
  <summary> /teams </summary>
  
  - Show current teams.
</details>

<details>
  <summary> /spec </summary>
  
  - Set or unset yourself as a spectator. A spectator will not be listed when someone uses the /list command, cannot be selected as captain, and cannot be picked.
</details>

<details>
  <summary> /swap </summary>
  
  - A captain can swap one player for another, either from one team to another or for a player who isn't on a team.
</details>

## 📦 How to install and invite the bot to your server:
You need to have [node.js](https://nodejs.org/en) installed.

Clone the project.

Install required packages into the project:
  ```bash
npm install
  ```

Copy the .env.example file to **.env** file to the project:
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
> Remember, it's crucial **not to share this token** with anyone else.

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
