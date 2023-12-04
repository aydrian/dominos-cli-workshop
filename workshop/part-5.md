# Part 5: The Validation Game

Anytime we accept input from the user, we want to ensure it is valid to the best of our ability. The [❯ Prompts](https://github.com/terkelg/prompts#readme) package allows us to provide a `validate` function for each prompt type. The previous developer only started adding validation shortly before their departure. Let's focus on adding validation to the payment prompt to ensure the order gets proper payment because we live in a no 💰 no 🍕 world.

## Add Validation for Order Payment

### 🧑‍💻 Task: Understand the payment prompt function

The `getPaymentFromPrompt()` function exists in the [`src/commands/order/index.ts`](../src/commands/order/index.ts) file. It's job is to collect credit card information from the user and return a payment object that can be used in the order. Before we start adding more validation, let's have Tabnine help us understand what's currently going on.

Highlight the function and ask Tabnine to explain by using `/explain-code` in the chat.

✅ This task has no solution... only knowledge.

### 🧑‍💻 Task: Add validation for security code

A security code is a 3 or 4 digit string depending on the credit card type. Refactor the `getPaymentFromPrompt()` function to include validation for the security code. We can ask Tabnine to assist us by higlighting the function and providing the following prompt in the chat:

> 🗣️ **Prompt** <br />
> a security code is a string that is 3 or 4 numbers long. It can't contain any letters. Refactor this function to ensure the security code is valid

Update the function based on the provided updated code.

Your result should look similar to the solution below:

<details> 
<br>
<summary>✅ Solution</summary>

```typescript
public async getPaymentFromPrompt(amountToCharge: number): Promise<Payment> {
    this.log('How would you like to pay?')

    const paymentInput = await prompts([
      ...
      {
        type: 'text',
        name: 'securityCode',
        message: 'What is your card security code?',
        validate(value) {
          const code = value.trim()
          return /^[0-9]{3,4}$/.test(code) ? true : 'Invalid security code'
        },
      },
      ...
    ])

  const payment = new Payment({...paymentInput, amount: amountToCharge})

  // prompt for tip amount
  payment.tipAmount = await this.getTipFromPrompt(amountToCharge)

  return payment
}
```

</details>

**Congrats! 🎉 We're one step closer to making sure the CLI only accepts valid input from our users.**

There are still lots of places that could use prompt validation, even in this function. As always, you're welcome to discover other places to add validation. With the help of Tabnine and the right prompt, we're sure you'll make short work of it. When you're ready, let's continue on with the next task.

| [Back](part-4.md) | [Next](part-7.md) |
| ----------------- | ----------------- |
