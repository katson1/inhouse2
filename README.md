# inhouse2
An in-house bot that drafts 2 teams and has an MMR system for custom games.

It will work like the [inhousebot](https://github.com/katson1/inhousebot), but super improved.

## 📦 How to use:
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
