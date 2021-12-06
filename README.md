## Getting started

```
npm install --save-dev @stkao05/liveblock-redux-devtool
```

```jsx
import { useReduxDevtool } from "@stkao05/liveblock-redux-devtool";

function Foo {
  useReduxDevtool();
}
```

`useReduxDevtool()` make use of Liveblock react hook, so the component should have `RoomProvider` as its ancestor.

```tsx
<RoomProvider>
  <Foo />
</RoomProvider>
```
