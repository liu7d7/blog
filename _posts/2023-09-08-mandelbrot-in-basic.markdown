---
layout: post
title: "Rendering the Mandelbrot Set in BASIC"
date: 2023-09-08 22:00:35 -0700
categories: rust koneko basic
---

The past few days, I've been working on a [BASIC interpreter](https://www.github.com/liu7d7/koneko), which I call koneko (kitten in Japanese). I wanted it to be like the classic BASIC language you'd find on a Commodore system or GW-BASIC on the IBM PC, but with some more modern
features in both the language and the editor.

| ![koneko editor](https://cdn.upload.systems/uploads/k95PyEVz.png) |
|:-----------------------------------------------------------------:|
|                *A screenshot of the koneko editor*                |

A few differences from the BASIC screen editors and syntax of old:
- Syntax highlighting! It looks a little busy, but I think the colors do work pretty well with the background in my opinion.
- Array syntax (`{a, b, c, ...}`). Some old BASIC dialects had tuple syntax, so why don't we just add it to this dialect too?
- It's not a screen editor. Unlike other editors that allow you to cursor around the screen, I've taken the shortcut of having a line editor with selection to save time during implementation. I can implement a screen editor later, but I've actually grown accustomed to this line editor.
- Assignment is an expression, so you can chain `x = y = z = 0` instead of maintaining three different line numbers, which is especially helpful in BASIC.
- Builtin statements (like `gosub` and `goto`) can be called in two ways: `gosub x` or `gosub(x)`

These differences are mostly convenience features (in my opinion), and the language is still BASIC at its core. 

The interpreter is implemented as a tree-walker (cos it's easy) in Rust, and all rendering commands draw to a buffer of `u32` which is then blitted to an SDL surface. This separation should make it easier to later on compile to WASM and use in a webpage (fingers crossed).

Alright, let's get to the Mandelbrot Set. I feel that it's a sort of acid test for languages, because it shows that a good amount of language constructs work, like comparisons, loops, and output, and also because it's so simple to implement. 

| ![Mandelbrot Set program in koneko](https://cdn.upload.systems/uploads/2b66XgcU.png) |
|:------------------------------------------------------------------------------------:|
|                *A listing of the program that generates the fractal*                 |

This code is translated straight from the pseudocode listed on the [Wikipedia page](https://en.wikipedia.org/wiki/Mandelbrot_set) for the Mandelbrot set, and you can see the result below!

![Video of the fractal being rendered](https://cdn.upload.systems/uploads/R5JBmo0Z.mp4)