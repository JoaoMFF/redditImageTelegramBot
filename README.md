# Telegram Bot: Fetch links from posts on Reddit

Simple Telegram bot that allows the users to fetch a random posts from Reddit.

### Technologies used

* Node

### Functionalities

* Able to fetch Images, GIFs, Links from the subreddit given by the user.
* It will post the url posted on reddit and the title of the post.
* Able to fetch the meaning of portuguese words given by the user

### Commands

> /r `<subredditname>`
> 
> /help
> 
> /subs
> 
> /spam
> 
> /dictionary `<word>`
> 
> /urban `<expression>`

Example

> /reddit cats
>
> /dictionary palavra
> 
> /urban wilding out

### Developing
Environment set up:
``` 
$ git clone <repo URL> 
$ cd <cloned repo>
$ npm install
$ docker compose up
```