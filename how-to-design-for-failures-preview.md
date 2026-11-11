# How to Design for Failures — ByteByteGo Newsletter

Source: https://blog.bytebytego.com/p/how-to-design-for-failures
Author: ByteByteGo (Alex Xu) · Oct 15, 2026 · Paid post

> **Note:** This is only the publicly served free preview. The full article is
> behind Substack's paywall (`∙ Paid`). The free path is the "Claim my free post"
> button on the page.

## Preview

It is impossible to build a failure-proof software system. Sure, a system can go
through its lifecycle without any failures. But you can't provide a guarantee that
it will never fail.

You might think that if we write perfect code, we can get rid of failures. But
writing correct application code is just one part of the problem. Even perfectly
written software depends on a physical computer, power availability, working
storage, and so on. If the machine loses power, the software will fail no matter
how good it is.

Therefore, you have to design for failure. This means deciding in advance how a
system should behave when some of its parts are not working correctly. In this
article, we'll look at the various strategies that can help developers deal with
failures in their systems.

## What the article covers

- Why adopt an "assume everything breaks" mindset
- Avoiding faults vs. tolerating faults
- How to figure out the scope of a failure
- How to reduce the impact of a failure
- How to handle failures while running the system correctly
- How to measure recovery from failures

## Where the paywall starts

The first gated section is **"Why Assume That Everything Can Break"**. Everything
after that heading requires the claim or a paid subscription.
