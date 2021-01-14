# game3js-auth

Backend agnostic authentication state management library for multiplayer servers

Currently supports:

* Nakama

Roadmap:

* Colyseus
* Geckos.io

## Installation

On static page:
```
<script src="https://unpkg.com/game3js-auth"/>
```

On node.js:
```
npm install game3js-auth
```

```
import 'game3js-auth'
```

## Quickstart

An example implementation is found at /index.html.

[First set up a local Nakama docker instance with the default settings]((https://heroiclabs.com/docs/install-docker-quickstart)).

Then:

```
npm run dev
```

## Example Implementation

```
const authStore = G3JSAuth.init(); 

let loginDetails = {
    username: "johnny@silverhand.com",
    password: "samurai"
}

const session = await authStore.login(loginDetails)

```

## Customizing Auth Options

Calling ```G3JSAuth.init()``` without any parameters initializes it with default settings. To change the options you can do:

```
import G3JSAuth from 'game3js-auth'

// replace with your settings
const authStore = G3JSAuth.init
    (
        G3JSAuth.NakamaConfig
            (
                {
                type: G3JSAuth.CONSTANTS.SERVER_TYPES.NAKAMA,
                url: "http://127.0.0.1",
                port: 7350,
                key: "defaultkey"   
                }
            )  
    )

```

## Licenses

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](https://github.com/alto-io/contractor/blob/master/LICENSE)