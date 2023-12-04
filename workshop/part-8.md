# Part 8: Don't Forget to Document

## Add JSDoc annotations for functions

### 🧑‍💻 Task: Update JSDoc for updated `updateProfile()` function

To make our test pass in Part 7, we had to update this function to make it throw an error. Let's update the JSDoc to annotate that an error can be thrown. Open the [`src/lib/config.ts`](../src/lib/config.ts) and locate the `updateProfile` function. We ask Tabnine to update the JSDoc by highlighting it and providing the chat with the following prompt:

> 🗣️ **Prompt** <br />
> Document this function and include @throws.

Update the JSDoc for this function to include any provided updates.

Your result should look similar to the solution below:

<details> 
<br>
<summary>✅ Solution</summary>

```typescript
/**
 * Updates the customer's profile information in the configuration file.
 *
 * @param profile The updated profile information
 * @throws An error if no profile is found
 * @returns null
 */
```

</details>

### 🧑‍💻 Task: Add JSDoc for `getPaymentFromPrompt()` function

All the command files still need to be documented, but for now, let's focus on just one function. Open the [`src/commands/order.ts`](../src/commands/order.ts) file and locate the `getPaymentFromPrompt()` function. Let's again have Tabnine generate the JSDoc string for us, but this time we'll highlight the function and execute `/document-code` in the chat.

Once the documentation comments have been provided, you can click Insert to update the code.

Your result should look similar to the solution below:

<details> 
<br>
<summary>✅ Solution</summary>

```typescript
/**
 * Prompts the user to enter their payment information, including their credit card number, expiration date, security code, and postal code.
 * @param amountToCharge The total amount of the order, including the customer's purchase price and any applicable taxes or fees.
 * @returns A `Payment` object containing the user's payment information.
 */
```

</details>

**WooHoo! 🙌 You added some clarity to the code.**

The documentation task is far from done, but you should now be able to zip through it easy peasy with the help of Tabnine. You can proceed to the final part.

| [Back](part-7.md) | [Next](part-9.md) |
| ----------------- | ----------------- |
