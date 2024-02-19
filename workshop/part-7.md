# Part 7: Everybody Loves Unit Testing

A unit test is a block of code that verifies the accuracy of a smaller, isolated block of application code, typically a function or method. Regardless of whether or not we write them before or after creating the code they test, for this project, we're required to have them. We'll be using the [Vitest](https://vitest.dev/) testing framework. The following tasks will help us learn how Tabnine can assist in the testing process.

## Add tests and fix the code that fails

### 🧑‍💻 Task: Fix a failed test

If we were to run our tests, we would see that one is failing. In your terminal, run `npm run test` in the project root directory.

You should see that the "update profile should throw an error if the customer profile is not set up" test in [`src/lib/config.test.ts`](../src/lib/config.test.ts) is failing. Let's fix it.

The failing function lives in [`src/lib/config.ts`](../src/lib/config.ts). Open the file and locate the `updateProfile` function. We can ask Tabnine to refactor this function to pass the test by highlighting it and providing the chat with the following prompt:

> 🗣️ **Prompt** <br />
> Fix this function so that it will throw an error if there isn't an existing profile.

Update the function based on the updated code provided and rerun the tests. Does it pass?

Your result should look similar to the solution below:

<details> 
<br>
<summary>✅ Solution</summary>

```typescript
updateProfile(profile: Partial<Profile>) {
  if (!this.config.profile) {
    throw new Error('No profile found. Please run `dominos profile` to set up your profile.')
  }

  const updatedConfig = {...this.config.profile, ...profile}
  this.config.profile = updatedConfig
  this.writeConfig()
}
```

</details>

### 🧑‍💻 Task: Test for null when no profile fields are selected for update.

Now that our tests are all passing, let's run a test coverage report. Test coverage reports tell you what percentage of your code is covered by your test cases. In your terminal, run `npm run test` in the project root directory.

You'll notice that `update.ts` under `src/commands/profile` returns less than 100% coverage. Let's correct this. Open the [`src/commands/profile/update.ts`](./src/commands/profile/update.ts) and navigate to the lines listed in the "Uncovered Line #s" column. You should see the following code in the `run()` function:

```typescript
if (fields.length === 0) {
  return null
}
```

We currently don't have any test written to cover the case when a user doesn't select any profile fields to update. We can have Tabnine generate a new unit test by highlighting the `getUpdatesFromPrompt()` function and providing the following prompt in the chat:

> 🗣️ **Prompt** <br />
> Write a vitest unit test for this function to make sure it returns null if no fields are selected. Use prompts.inject() to respond to prompts.

Update [`src/commands/profile/update.test.ts`](./src/commands/profile/update.test.ts) based on the provided example and rerun the coverage report. Are we at 100%?

> [!TIP]
> Tabnine looks for context in other project files. If you don't get what you want at first, try helping Tabnine by visiting similar files. Then try your prompt again. You also might want to adjust the prompt.

Your result should look similar to the solution below:

<details> 
<br>
<summary>✅ Solution</summary>

```typescript
it('should return null if no fields are selected', async () => {
  prompts.inject([[]])
  const updates = await Update.prototype.getUpdatesFromPrompt()

  expect(updates).toBeNull()
})
```

> [!NOTE]
> Vitest is still a relatively new testing framework. It's possible that there just isn't enough training data available for Tabnine's models yet. You're likely seeing code that includes Jest, which is a popular framework that's been around for a while. The good news is that Vitest uses Jest so only small tweaks are required.

</details>

**You did it! 🎉 You fixed a failing test and improved test coverage.**

Feel free to check out other areas that might not have complete coverage and see if you can get them to 💯. Remember, the Domino's team won't settle for less. On to the next task.

| [Back](part-5.md) | [Next](part-8.md) |
| ----------------- | ----------------- |
