# SwiftCart — E-Commerce Website

    An Ecommerce website built with HTML, Tailwind CSS, DaisyUI, and Vanilla JavaScript. It fetches and displays product data from the FakeStore API.


---

## Questions and Answers

### 1) What is the difference between null and undefined?

`undefined` এর অর্থ দাঁড়ায়, একটা ভ্যারিয়েবল ডিক্লেয়ার করা হয়েছে কিন্তু তাতে কোনো মান বসানো হয়নি। জাভাস্ক্রিপ্ট নিজে থেকেই এই ভ্যালু দেয়।

### 2) What is the use of the map() function in JavaScript? How is it different from forEach()?

`map()` হলো একটা array method যেটা একটা array এর প্রতিটা element এর উপর একটা function চালায় এবং **নতুন একটা array return** করে। মূল array পরিবর্তন হয় না।

### 3) What is the difference between == and ===?

`==` হলো **loose equality** বা abstract equality। এটা দুইটা value compare করার সময় **type conversion** (coercion) করে। মানে দুইটা value এর type আলাদা হলেও, JS চেষ্টা করে এদের একই type এ নিয়ে আসতে, তারপর compare করে।

### 4) What is the significance of async/await in fetching API data?

API থেকে ডাটা আনা একটা **asynchronous** কাজ — মানে ডাটা আসতে সময় লাগে, আর JavaScript তখনও বাকি code চালাতে থাকে। আগে এই কাজ `.then().catch()` chain দিয়ে করতে হতো যেটা কিছুটা জটিল দেখায়।

`async`/`await` এটাকে অনেক সহজ ও পড়তে সুবিধা (readable) করে দেয়। `async` keyword একটা function কে asynchronous বানায়, আর `await` keyword JavaScript কে বলে "এই Promise resolve না হওয়া পর্যন্ত wait করো"।

### 5) Explain the concept of Scope in JavaScript (Global, Function, Block).

**Scope** হলো — কোনো variable কোথায় কোথায় access করা যাবে সেটার নিয়ম। JavaScript এ তিন ধরনের scope আছে:

#### Global Scope
যেকোনো function বা block (`{}`) এর বাইরে declare করা variable হলো global। পুরো প্রোগ্রামের যেকোনো জায়গা থেকে এটা access করা যায়। 

#### Function Scope
একটা function এর ভিতরে `var`, `let` বা `const` দিয়ে declare করা variable শুধু সেই function এর ভিতরেই access করা যায়। বাইরে থেকে পাওয়া যাবে না।

#### Block Scope
`let` এবং `const` দিয়ে declare করা variable শুধু সেই block (`{}`) এর ভিতরেই থাকে — যেমন `if`, `for`, `while` ইত্যাদির ভিতরের `{}`। কিন্তু `var` block scope মানে না, সে function scope follow করে।
