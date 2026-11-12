---
title: "Practice: Build a Shop Checkout"
description: Practice objects, arrays, and functions with a team coding contest.
---

# Practice: Build a Shop Checkout

[نسخهٔ فارسی](/front/js/07b-shop-session-fa)

**You know:** variables, conditions, loops, functions, and arrays.

**Today:** use objects to describe products, then build a checkout together. An object stores details about one thing. An array stores a list of things.

## Plan

1. Warm-up: functions and arrays.
2. Learn objects.
3. Practice together.
4. Team contest.
5. Test, explain, and review.

## 1. Warm-up

Write `sumNumbers(numbers)`. Return the sum. Use a loop.

```js
sumNumbers([10, 20, 30]); // 60
sumNumbers([5]);         // 5
sumNumbers([]);          // 0
```

**Question:** What happens if you use `console.log()` instead of `return`?

## 2. Learn: Objects

An object has named properties.

```js
const product = {
  name: "Notebook",
  price: 50000,
  quantity: 2,
};

console.log(product.name); // Notebook
console.log(product.price * product.quantity); // 100000

product.quantity = 3;
console.assert(product.quantity === 3, "Quantity should change");
```

**Try it:**

1. Create a `student` object with `name` and `age`.
2. Print the name.
3. Change the age.
4. Add a `city` property.

## 3. Practice Together: A Product List

```js
const cart = [
  { name: "Notebook", price: 50000, quantity: 2 },
  { name: "Pen", price: 20000, quantity: 3 },
];

for (const product of cart) {
  console.log(product.name, product.price * product.quantity);
}
```

**Your turn:**

- Add one more product.
- Print each product's name and quantity.
- Calculate the total before any discount.

**Question:** Why is `cart` an array, but each product an object?

## 4. Team Contest: Fix the Checkout

The shop's checkout is broken. Your team's task is to fix it.

- Work in pairs. Take turns typing.
- Use JavaScript and the console. No HTML or CSS.
- Notes and documentation are allowed. No AI or copied solutions during the contest.
- All prices are in tomans. Prices and quantities are positive integers.
- Do not change the input cart. Input validation is not required today.

### Submission Format

These are custom **LeetCode-style** problems. Complete the functions below. No standard-input parser is needed.

- Problems A and B: return a number; do not print the answer.
- Problem C: print the receipt; no return value is required.
- All inputs follow the constraints. Do not change them.

### Problem A — Discount Day

**Difficulty:** Easy · **Points:** 25

A customer buys `quantity` copies of a product. Each copy costs `price` tomans.

If the total is at least **500000**, the customer gets **10% off**. Otherwise, there is no discount.

Return the amount the customer must pay.

**Example 1**

```text
Input: price = 50000, quantity = 2
Output: 100000
Explanation: The total is below 500000. No discount applies.
```

**Example 2**

```text
Input: price = 100000, quantity = 5
Output: 450000
Explanation: The total is exactly 500000. The discount is 50000.
```

**Example 3**

```text
Input: price = 200000, quantity = 3
Output: 540000
Explanation: The total is 600000. The discount is 60000.
```

**Constraints**

- `10 <= price <= 1000000`
- `price` is an integer and a multiple of `10`.
- `1 <= quantity <= 1000`, and `quantity` is an integer.
- These constraints ensure the final amount is a whole number.

**JavaScript Starter**

```js
function getFinalPrice(price, quantity) {
  // Write your code here.
}
```

### Problem B — Shopping Cart

**Difficulty:** Easy · **Points:** 35

You are given an array `cart`. Each item is an object with `name`, `price`, and `quantity`.

Return the final amount for the whole cart. Apply a **10% discount** if the total before discount is at least **500000**.

Apply the discount **once to the whole cart**, not separately to each item. Return `0` for an empty cart.

**Example 1**

```text
Input: cart = [
  { name: "Notebook", price: 50000, quantity: 2 },
  { name: "Pen", price: 20000, quantity: 3 }
]
Output: 160000
Explanation: 100000 + 60000 = 160000. No discount applies.
```

**Example 2**

```text
Input: cart = [
  { name: "Bag", price: 300000, quantity: 1 },
  { name: "Book", price: 100000, quantity: 2 }
]
Output: 450000
Explanation: Together the items cost 500000, so the discount applies.
```

**Example 3**

```text
Input: cart = []
Output: 0
```

**Constraints**

- `0 <= cart.length <= 1000`
- Each item's `price` and `quantity` follow Problem A's constraints.
- Each `name` contains 1–30 English letters, with no spaces.
- Different items may have the same name. Count every item.

**JavaScript Starter**

```js
function getCartTotal(cart) {
  // Write your code here.
}
```

### Problem C — Print the Receipt

**Difficulty:** Easy · **Points:** 20

Given a `cart`, print one line for each item, in the original order:

```text
NAME xQUANTITY: LINE_TOTAL
```

`LINE_TOTAL` is the item's price multiplied by its quantity, **before discount**.

Finally, print `Total: FINAL_TOTAL`. Call your `getCartTotal(cart)` function to get this amount. Match the spaces and capitalization shown below. Print no extra lines or currency symbols.

**Example 1**

```text
Input: cart = [
  { name: "Notebook", price: 50000, quantity: 2 },
  { name: "Pen", price: 20000, quantity: 3 }
]
Output:
Notebook x2: 100000
Pen x3: 60000
Total: 160000
```

**Example 2**

```text
Input: cart = [{ name: "Bag", price: 300000, quantity: 2 }]
Output:
Bag x2: 600000
Total: 540000
```

**Example 3**

```text
Input: cart = []
Output:
Total: 0
```

**Constraints:** Same as Problem B.

**JavaScript Starter**

```js
function printReceipt(cart) {
  // Write your code here. Reuse getCartTotal.
}
```

### Scoring

The remaining **20 points**: explain your code (10), clear names and readable code (10).

Correctness comes first. Speed only breaks a tie. Test empty carts, totals below the discount, exactly 500000, and above 500000.

**Bonus, no points:** return the name of the product with the highest unit price. Return `null` for an empty cart. If prices tie, return the first one.

## 5. Review Questions

1. What is the difference between an array and an object?
2. How do you read and change an object's property?
3. Why does `getCartTotal` return a value, but `printReceipt` print it?
4. Why must the discount happen after adding all products?
5. What should your function return for an empty cart?

## 6. Related Course Videos

Local course: `~/Videos/Udemy - The Complete JavaScript Course 2024 From Zero to Expert! 2023-11/`

All videos below are in **03 - JavaScript Fundamentals – Part 2**. Matching English `.srt` subtitles are available.

### Watch for Today

| File | Length | Use |
| --- | --- | --- |
| `014 Introduction to Objects.mp4` | 6:09 | Main lesson: describe a product with properties. |
| `015 Dot vs. Bracket Notation.mp4` | 19:21 | Read and change properties. Focus on basic property access today. |

Watch before class, or use short clips during the lesson.

### Review Only If Needed

| File | Length | Use |
| --- | --- | --- |
| `003 Functions.mp4` | 19:09 | Parameters and return values. |
| `006 Functions Calling Other Functions.mp4` | 10:08 | Call `getCartTotal` from `printReceipt`. |
| `010 Introduction to Arrays.mp4` | 21:35 | Store a list of products. |
| `019 Iteration The for Loop.mp4` | 11:12 | Repeat steps with a loop. |
| `020 Looping Arrays, Breaking and Continuing.mp4` | 22:02 | Visit array items and calculate totals. |

**Save for later:** `016 Object Methods.mp4` (23:05). Functions stored inside objects are not needed for today's contest; learn them before LeetCode 2704.

## 7. Related LeetCode Practice

The shop contest above is a custom exercise, not an exact LeetCode problem. These are related problems; summaries below are paraphrased.

| Problem | Task | When |
| --- | --- | --- |
| [1480. Running Sum of 1d Array](https://leetcode.com/problems/running-sum-of-1d-array/) | Return an array where each item is the sum of all items up to that position. | Warm-up extension: loops and totals. |
| [1672. Richest Customer Wealth](https://leetcode.com/problems/richest-customer-wealth/) | Add each customer's account balances, then return the largest total. | Homework: nested arrays and loops. |
| [2704. To Be Or Not To Be](https://leetcode.com/problems/to-be-or-not-to-be/) | Return an object with functions that check whether two values match. | Later: learn functions inside objects first. |

**Start with 1480.** Example: `[1, 2, 3, 4]` becomes `[1, 3, 6, 10]`.

LeetCode blocked automated access during preparation. Links are provided, but live problem pages were not verified.
