# Part 2: Onboarding

![Hello Computer](https://media.giphy.com/media/PxSFAnuubLkSA/giphy.gif)

## 💻 Your Development Environment

We thank you for providing your own laptop for this project. Please have the following installed on your machine.

- Git
- Node.js 18+ with npm
- Your choice of the following IDEs:
  - Visual Studio
  - Visual Studio Code
  - WebStorm
  - NeoVim (if you're feeling dangerous)
- Access to your GitHub account

## 📥 Download the code

Now that we have our environment set up, let's clone the repository and make sure it's working properly.

- In your terminal, clone this GitHub repository to a directory of your choosing
  ```shell
  git clone git@github.com:aydrian/dominos-cli-workshop.git
  ```
- Change directories to the dominos-cli-workshop directory and install the dependencies
  ```shell
  cd dominos-cli-workshop
  npm install
  ```
- Run the tests to make sure everything is working properly
  ```shell
  npm run test
  ```

You're now ready to start developing

## 🔨 Application Layout

This application was created using the OCLIF Generator. We'll mostly be working in the `/src` directory. The code for the different commands exist in the `/src/commands` directory. Tests are co-located with the files they are testing and have the `.test.ts` extension. The `/src/lib` directory contains the file responsible for reading and writing the config file used to persist user configuration.

Don't worry, each exercise will point you to the file you need to modify.

## ▶️ Run the CLI

Let's run the application for the first time. There are two ways to run the application. You build and run it using `npm run build && ./bin/run.js` (`run.cmd` for Windows users) or run it in dev mode using `./bin/dev.js` (`dev.cmd` for Windows users).

Let's run the profile command. In your terminal from the project root directory execute the following:

```shell
npm run build && ./bin/run.js profile
```

Because this is the first time running the command, you will be prompted to fill out your user profile.

![Profile Command](./assets/initial-profile-command.gif)

Now, if you run the command again, you will see your profile displayed.

You can search for and set your favorite store with the following command:

```shell
npm run build && ./bin/run.js store search
```

Now that you have a profile and favorite store, you can try ordering a pizza with the following command:

```shell
npm run build && ./bin/run.js order
```

> [!NOTE]
> You'll want to use a fake credit card unless you really want to order a pizza. You can find a list of fake credit cards in the table below.

### Fake Credit Cards

| Type             | Card Number      | Expiration | Security Code |
| ---------------- | ---------------- | ---------- | ------------- |
| American Express | 379482514150104  | 12/2025    | 7956          |
| Visa             | 4032033011977175 | 04/2025    | 375           |
| Master Card      | 5110925981962552 | 09/2025    | 192           |

**We're almost ready to dive into the tasks, but first we'll install a plugin to help accelerate the process.**

| [Back](part-1.md) | [Next](part-3.md) |
| ----------------- | ----------------- |
