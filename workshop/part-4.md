# Part 4: Enhancing the UX

To assist with the overall user experience, we're using prompts from the [❯ Prompts](https://github.com/terkelg/prompts#readme) package. There are many types of prompts available to use, but unfortunately, the previous developer used the text prompt in places where an alternative prompt would have been more appropriate. Let's look at one of the places that could be improved just by changing the prompt type.

## Update Profile State prompt to be an autocomplete type

### 🧑‍💻 Task: Fifty nifty[^1] tedious choices to code

To use the [autocomplete][1] prompt, you'll need to create a list of choices. Each choice is made up of a title that displays to the user and a value used by the CLI. That's a lot of typing and honestly, is time better spent doing something else...like petting a dog. Let's instead use Tabnine's chat to generate the list of choices for us. Use the prompt below and insert the code at the bottom of the [`src/commands/profile/index.ts`](../src/commands/profile/index.ts) file. Be sure to export it so we can use it later.

> 🗣️ **Prompt** <br />
> A choice is an object containing a title and value. Create an array of choices for each of the 50 United States where the value is the two-letter postal code named stateChoices.

Your result should look similar to the solution below:

<details> 
<br>
<summary>✅ Solution</summary>

```typescript
export const stateChoices = [
  {title: 'Alabama', value: 'AL'},
  {title: 'Alaska', value: 'AK'},
  {title: 'Arizona', value: 'AZ'},
  {title: 'Arkansas', value: 'AR'},
  {title: 'California', value: 'CA'},
  {title: 'Colorado', value: 'CO'},
  {title: 'Connecticut', value: 'CT'},
  {title: 'Delaware', value: 'DE'},
  {title: 'District Of Columbia', value: 'DC'},
  {title: 'Florida', value: 'FL'},
  {title: 'Georgia', value: 'GA'},
  {title: 'Hawaii', value: 'HI'},
  {title: 'Idaho', value: 'ID'},
  {title: 'Illinois', value: 'IL'},
  {title: 'Indiana', value: 'IN'},
  {title: 'Iowa', value: 'IA'},
  {title: 'Kansas', value: 'KS'},
  {title: 'Kentucky', value: 'KY'},
  {title: 'Louisiana', value: 'LA'},
  {title: 'Maine', value: 'ME'},
  {title: 'Maryland', value: 'MD'},
  {title: 'Massachusetts', value: 'MA'},
  {title: 'Michigan', value: 'MI'},
  {title: 'Minnesota', value: 'MN'},
  {title: 'Mississippi', value: 'MS'},
  {title: 'Missouri', value: 'MO'},
  {title: 'Montana', value: 'MT'},
  {title: 'Nebraska', value: 'NE'},
  {title: 'Nevada', value: 'NV'},
  {title: 'New Hampshire', value: 'NH'},
  {title: 'New Jersey', value: 'NJ'},
  {title: 'New Mexico', value: 'NM'},
  {title: 'New York', value: 'NY'},
  {title: 'North Carolina', value: 'NC'},
  {title: 'North Dakota', value: 'ND'},
  {title: 'Ohio', value: 'OH'},
  {title: 'Oklahoma', value: 'OK'},
  {title: 'Oregon', value: 'OR'},
  {title: 'Pennsylvania', value: 'PA'},
  {title: 'Rhode Island', value: 'RI'},
  {title: 'South Carolina', value: 'SC'},
  {title: 'South Dakota', value: 'SD'},
  {title: 'Tennessee', value: 'TN'},
  {title: 'Texas', value: 'TX'},
  {title: 'Utah', value: 'UT'},
  {title: 'Vermont', value: 'VT'},
  {title: 'Virginia', value: 'VA'},
  {title: 'Washington', value: 'WA'},
  {title: 'West Virginia', value: 'WV'},
  {title: 'Wisconsin', value: 'WI'},
  {title: 'Wyoming', value: 'WY'},
]
```

</details>

### 🧑‍💻 Task: Refactor the Profile prompt to use autocomplete

Now that we have a list of state choices, let's put it to use. In the [`src/commands/profile/index.ts`](../src/commands/profile/index.ts) file, refactor the `getProfileFromPrompt()` function to allow users to select a state using an [autocomplete][1] prompt with the choices above.

> [!TIP]
> Try highlighting the function and using the chat with the following prompt to help you out:
> "Refactor this function to use an autocomplete type with the state choices for the state input."

Your result should look similar to the solution below:

<details> 
<br>
<summary>✅ Solution</summary>

```typescript
public async getProfileFromPrompt(): Promise<ProfileType> {
  const profile = await prompts([
    {type: 'text', name: 'firstName', message: 'What is your first name?'},
    {type: 'text', name: 'lastName', message: 'What is your last name?'},
    {type: 'text', name: 'email', message: 'What is your email?'},
    {type: 'text', name: 'phone', message: 'What is your phone number?'},
    {type: 'text', name: 'address1', message: 'What is your address?'},
    {type: 'text', name: 'address2', message: 'What is your address (line 2)?'},
    {type: 'text', name: 'city', message: 'What is your city?'},
    {
      type: 'autocomplete',
      name: 'state',
      message: 'What is your state?',
      choices: stateChoices,
    },
    {type: 'text', name: 'zip', message: 'What is your zip code?'},
  ]);

  return profile;
}
```

</details>

### 🧑‍💻 Task: Once more with feeling

We also prompt the user to enter a state when they need to update their profile. Let's make the same change to the `getUpdatesFromPrompt()` function in the [`src/commands/profile/update.ts`](../src/commands/profile/update.ts) file.

Can you tell what's happening in this function? If not, try highlighting it and asking Tabnine to explain it by using `/explain-code` in the chat.

With the function highlighted, use the following prompt to refactor the code.

> 🗣️ **Prompt** <br />
> Update this function to use an autocomplete prompt for the state. Import the state choices from @Profile and use them.

> [!NOTE]
> You may need to add `import {stateChoices} from './index.js'` to the top of the update command file.

Your result should look similar to the solution below:

<details> 
<br>
<summary>✅ Solution</summary>

```typescript
import {stateChoices} from './index.js'
...

public async getUpdatesFromPrompt(): Promise<Partial<Profile> | null> {
  const response = await prompts([
    ...
    {
      type: (prev: string, values: Record<string, string | string[]>) =>
        values.fields.includes('state') ? 'autocomplete' : null,
      name: 'state',
      message: 'What is your state?',
      choices: stateChoices,
    },
    ...
  ])

  const {fields, ...profile} = response

  if (fields.length === 0) {
    return null
  }

  return profile
}
```

</details>

**Congrats! 🎉 You just improved the user experience.**

This is just one place where the user experience can be improved using the different [prompt types](https://github.com/terkelg/prompts#-types) provided by the Prompts library. Feel free to come back and find any other prompts in the project that could be improved using a different type. But for now, let's move on to the next task.

| [Back](part-3.md) | [Next](part-5.md) |
| ----------------- | ----------------- |

[^1]: 51 choices including DC

[1]: https://github.com/terkelg/prompts#autocompletemessage-choices-initial-suggest-limit-style
