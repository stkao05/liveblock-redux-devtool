import { useEffect } from "react";
import { useRoom } from "@liveblocks/react";
import { LiveObject, LiveList, LiveMap } from "@liveblocks/client";

const withDevtool =
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  window.__REDUX_DEVTOOLS_EXTENSION__;

export const useReduxDevtool = () => {
  const room = useRoom();

  useEffect(() => {
    async function live() {
      window.__REDUX_DEVTOOLS_EXTENSION__.connect();

      const { root } = await room.getStorage();
      const rootObj = objectify(root);
      window.__REDUX_DEVTOOLS_EXTENSION__.send("INIT", rootObj);

      room.subscribe(
        root,
        () => {
          const rootObj = objectify(root);
          window.__REDUX_DEVTOOLS_EXTENSION__.send("UPDATE", rootObj);
        },
        { isDeep: true }
      );
    }

    if (withDevtool) {
      live();
    }
  }, [room]);
};

function isLiveItem(obj) {
  return (
    obj instanceof LiveObject ||
    obj instanceof LiveList ||
    obj instanceof LiveMap
  );
}

function mapValues(obj, func) {
  const res = {};
  for (const key in obj) {
    res[key] = func(obj[key]);
  }
  return res;
}

function objectify(item) {
  if (!isLiveItem(item)) {
    return item;
  }

  if (item instanceof LiveObject) {
    const obj = item.toObject();
    const res = mapValues(obj, (v) => objectify(v));
    return res;
  }

  if (item instanceof LiveList) {
    const res = item.toArray().map((x) => objectify(x));
    return res;
  }

  if (item instanceof LiveMap) {
    const obj = Object.fromEntries(item.entries());
    const res = mapValues(obj, (v) => objectify(v));
    return res;
  }

  return item;
}
