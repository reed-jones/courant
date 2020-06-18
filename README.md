# Courant

Courant aims to be a useful set of Vue 3 renderless WebRTC Vue components for adding Video Chat capabilities or Screen Sharing to your app.

## Install

```sh
yarn add courant
# or
npm install courant
```

```js
import Courant from "courant";

app.use(Courant, {
  // Your Websocket Host
  io: io("http://localhost:3000"),

  // auto connect on mount? (optional)
  autoConnect: true,
});
```


## Components

### CourantProvider

```html
<courant-provider
  :room="yourRoomName"
  :username="yourUserName"
>
<!-- Your App -->
</courant-provider>
```

| Prop Name    | default   |
| ------------ | --------- |
| room         | 'public'  |
| username     | 'unknown' |
| auto-connect | null      |
| socket-url   | null      |

### CourantStream
// TODO

### CourantControls
// TODO

### CourantChat
// TODO
