import {
  useSpring,
  animated,
  useSpringRef,
  useSprings,
  useTransition,
  useTrail,
  useChain,
} from "@react-spring/web";
import {
  List,
  MultiGrid,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
} from "react-virtualized";
import logo from "./logo.svg";
import "./App.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { adder, editer, deleter, updater, selectAll } from "./reducers";
import { editing, dataFetcher } from "./actions";
import AppRoutes from "./router/appRoutes";
import AppNavBar from "./router/appNavbar";
import { getCurrentUser } from "@aws-amplify/auth";

import { withAuthenticator, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App() {
  const [us, setUs] = useState("");
  useEffect(() => {
    async function getUser() {
      try {
        const user = await getCurrentUser();
        setUs({
          username: user.username,
          email: user.attributes.email,
          // Add other attributes you want to retrieve
        });

        console.log("okay status, should retrive");
      } catch (error) {
        console.log("Error fetching current user", error);
        //return null;
      }
    }
    getUser();
  }, [us]);

  const ref1 = useSpringRef();
  const ref2 = useSpringRef();

  const props = useSpring({
    ref: ref1,
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
    config: { duration: 20000 },
    loop: true,
  });

  const listEls = Array.from({ length: 10 }, (el, index) => index);

  const styles = useTrail(listEls.length, {
    ref: ref2,
    from: { transform: "translateX(-100%)" },
    to: { transform: "translateX(100%)" },
  });

  useChain([ref1, ref2]);

  const transitions = useTransition(listEls, {
    keys: (item) => item,
    enter: { color: "green", opacity: 1 },
    leave: { color: "red", opacity: 0 },
    from: { color: "blue", opacity: 0 },
  });

  const springs = useSprings(
    listEls.length,
    listEls.map((el, index) => ({
      from: { transform: "translateX(-100%)" },
      to: { transform: "translateX(100%)" },
      delay: index * 300,
    }))
  );
  const mathced = useMediaQuery(
    "(((min-width: 600px) and (max-width: 800px)) or (max-width: 500px)) or (min-resolution:192dpi)"
  );
  //(min-resolution:144dpi)

  //localStorage.removeItem("first");
  const { stored, updateValue } = useLocalStorage("firstwww", "");

  const dispatch = useDispatch();

  const items = useSelector(selectAll);
  //const { data: items, id } = useSelector((state) => state.items);
  const { id } = useSelector((state) => state.items);

  /*const itemsSelector = createSelector((state)=>state.items, (data)=>data.data)
const items = useSelector(itemsSelector);*/

  const [input, setInput] = useState("");
  const [change, setChange] = useState(false);

  useEffect(() => {
    dispatch(dataFetcher());
  }, [dispatch]);

  const {
    data: loaded,
    error: err,
    loading: load,
  } = useSelector((state) => state.data);

  const asyncFn = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("not valid data: " + response.status);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  const { data, error, loading } = useAsync(
    asyncFn,
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  if (loading) {
    return <div>Loading... status: {`${loading}`}</div>;
  }
  if (error) {
    return <div>Error occurred: error: {`${error.message}`}</div>;
  }
  const handleChange = (task) => {
    setInput(task);
    return task;
  };

  return (
    <div className="App">
      <div className="navBased">
        <AppNavBar />
        <AppRoutes />
      </div>
      <div>
        {us ? (
          <div>
            username: {us.username} email: {us.email}{" "}
          </div>
        ) : (
          "not work"
        )}
      </div>
      <Authenticator>
        {({ signOut, user }) => (
          <div className="user">
            {user ? (
              <div>
                <p>current user: {user.username}</p>
                <button type="button" onClick={signOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        )}
      </Authenticator>
      <VirtualizeApp />
      <div className="reduxTD">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (change) dispatch(editing({ task: e.target.value, id: id }));
          }}
        />

        {!change ? (
          <button
            onClick={() => {
              dispatch(adder({ task: input, id: items.length }));
              setInput("");
            }}
          >
            Int
          </button>
        ) : (
          <button
            onClick={() => {
              dispatch(editer({ changes: { task: input }, id: id }));
              setInput("");
              setChange((val) => !val);
            }}
          >
            Edit
          </button>
        )}
        {items.map((el, index) => (
          <li key={index}>
            {el.task}
            <button
              onClick={() => {
                dispatch(updater({ task: handleChange(el.task), id: el.id }));
                setChange((val) => !val);
              }}
            >
              update
            </button>
            <button
              onClick={() => {
                dispatch(deleter(el.id));
                if (el.id === id) {
                  setChange((val) => (val === true ? false : false));
                }
              }}
            >
              delete
            </button>
          </li>
        ))}
        <br />
        <button onClick={() => dispatch({ type: "DEFAULT" })}>Reset</button>

        <div>
          <p>Loaded data: {loaded && `${loaded.body}`}</p>
          <p>Load status: {`${load}`}</p>
          <p>Error status: {err && `${err.message}`}</p>
        </div>
      </div>

      <div>
        <h2>{data.title}</h2>
        <div>{data.body}</div>
      </div>
      {mathced ? <div>Matched</div> : ""}
      <input
        type="text"
        value={stored}
        onChange={(e) => updateValue(e.target.value)}
      />
      <div>Stored value: {stored}</div>
      <header className="App-header">
        <animated.img
          src={logo}
          style={props}
          className="App-logo"
          alt="logo"
        />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          .
        </a>
        <br />
        {styles.map((style, index) => (
          <animated.div style={style}>{listEls[index]}</animated.div>
        ))}
        {transitions((style, item) => (
          <animated.div style={style}>{item}</animated.div>
        ))}
        {springs.map((style, index) => (
          <animated.div
            style={{ ...style, backgroundColor: "pink", color: "#111" }}
          >
            {listEls[index]}
          </animated.div>
        ))}
      </header>
    </div>
  );
}

const VirtualizeApp = () => {
  const refEl = useRef(null);
  const refEl2 = useRef(null);

  const descrip = useCallback((ind) => {
    let str = "";
    for (let i = 0; i <= ind; i++) {
      str += `(Item ${ind + 1} description)\n`;
      if (i >= ind % 50) {
        break;
      }
    }
    return str;
  }, []);

  // virtualized in use
  const dataArray = useMemo(
    () =>
      Array.from({ length: 10000 }, (el, ind) => ({
        name: ind + 1,
        item: `Item ${ind + 1} `,
        description: descrip(ind),
      })),
    [descrip]
  );

  const contStyle = {
    backgroundColor: "#fff",
    color: "#111",
    padding: "10px",
    margin: "10px auto",
    border: "2px solid gray",
  };

  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 50,
      }),
    []
  );

  const cache1 = useMemo(
    () =>
      new CellMeasurerCache({
        defaultHeight: 50,
        fixedWidth: true,
      }),
    []
  );

  const cache2 = useMemo(
    () =>
      new CellMeasurerCache({
        defaultHeight: 50,
        fixedWidth: true,
      }),
    []
  );

  const renderCell = useCallback(
    ({ columnIndex, key, rowIndex, style, parent }) => {
      const cellData =
        rowIndex === 0
          ? Object.keys(dataArray[0])[columnIndex]
          : dataArray[rowIndex - 1][Object.keys(dataArray[0])[columnIndex]];

      return (
        <CellMeasurer
          parent={parent}
          cache={cache1}
          key={key}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
        >
          {({ measure }) => (
            <RenderItem
              measure={measure}
              columnIndex={columnIndex}
              style={style}
              rowIndex={rowIndex}
              cellData={cellData}
            />
          )}
        </CellMeasurer>
      );
    },
    [dataArray, cache1]
  );

  const renderList = useCallback(
    ({ index, key, style, parent }) => {
      return (
        <CellMeasurer cache={cache} parent={parent} rowIndex={index} key={key}>
          {({ measure }) => (
            <RenderList
              measure={measure}
              refEl={refEl}
              style={style}
              index={index}
              dataArray={dataArray}
              cache={cache}
            />
          )}
        </CellMeasurer>
      );
    },
    [dataArray, cache]
  );

  return (
    <>
      <div className="virtualized" style={{ ...contStyle, height: "500px" }}>
        <AutoSizer>
          {({ width, height }) => (
            <MultiGrid
              ref={refEl2}
              rowCount={dataArray.length + 1}
              rowHeight={cache1.rowHeight}
              width={600}
              height={height}
              columnCount={Object.keys(dataArray[0]).length}
              columnWidth={200}
              fixedColumnCount={1}
              fixedRowCount={1}
              cellRenderer={renderCell}
              deferredMeasurementCache={cache1}
            />
          )}
        </AutoSizer>
      </div>
      <br />
      <div
        style={{
          ...contStyle,
          height: "500px",
        }}
      >
        <AutoSizer>
          {({ width, height }) => (
            <Grid
              height={height}
              width={width}
              rowCount={dataArray.length + 1}
              columnCount={Object.keys(dataArray[0]).length}
              columnWidth={200}
              rowHeight={cache2.rowHeight}
              deferredMeasurementCache={cache2}
              cellRenderer={({ style, rowIndex, columnIndex, key, parent }) => {
                const cellData =
                  rowIndex === 0
                    ? Object.keys(dataArray[0])[columnIndex]
                    : dataArray[rowIndex - 1][
                        Object.keys(dataArray[0])[columnIndex]
                      ];
                return (
                  <CellMeasurer
                    parent={parent}
                    cache={cache2}
                    key={key}
                    rowIndex={rowIndex}
                    columnIndex={columnIndex}
                  >
                    {({ measure }) => (
                      <CellRenderer
                        cellData={cellData}
                        measure={measure}
                        rowIndex={rowIndex}
                        style={style}
                      />
                    )}
                  </CellMeasurer>
                );
              }}
            />
          )}
        </AutoSizer>
      </div>
      <br />
      <div className="virtualized" style={{ ...contStyle, height: "500px" }}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={refEl}
              rowCount={dataArray.length}
              rowHeight={cache.rowHeight}
              width={width}
              height={height}
              rowRenderer={renderList}
              deferredMeasurementCache={cache}
            />
          )}
        </AutoSizer>
      </div>
    </>
  );
};

const CellRenderer = ({ measure, cellData, style, rowIndex }) => {
  const [first, setFirst] = useState(true);

  useEffect(() => {
    measure();
    if (first) setFirst(false);
  }, [measure, first]);

  return (
    <div
      style={{
        ...style,
        backgroundColor: rowIndex % 2 ? "aliceblue" : "#fff",
        fontWeight: rowIndex === 0 ? "bold" : "",
      }}
    >
      {cellData}
    </div>
  );
};

const RenderItem = ({ measure, style, cellData, rowIndex, columnIndex }) => {
  const [first, setFirst] = useState(true);

  useEffect(() => {
    measure();
    if (first) setFirst(false);
  }, [measure, first]);

  return (
    <div
      style={{
        ...style,
        backgroundColor: columnIndex % 2 ? "aliceblue" : "#fff",
        fontWeight: rowIndex === 0 ? "bold" : "",
      }}
    >
      {cellData}
    </div>
  );
};

const RenderList = ({ measure, refEl, style, index, dataArray, cache }) => {
  const [toggle, setToggle] = useState(false);
  const [first, setFirst] = useState(true);

  useEffect(() => {
    measure();
    if (first) setFirst(false);
  }, [measure, toggle, first]);

  return (
    <div
      style={{
        ...style,
        backgroundColor: index % 2 ? "aliceblue" : "#fff",
        padding: "10px",
      }}
    >
      {toggle ? dataArray[index]["name"] : dataArray[index]["description"]}
      <br />
      <button
        type="button"
        onClick={() => {
          setToggle((val) => !val);
          cache.clear(index);
        }}
      >
        Update
      </button>
    </div>
  );
};

const useAsync = (asynFunction, url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        setLoading(true);
        const response = await asynFunction(url);
        setData(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, [asynFunction, url]);

  return { data, error, loading };
};

const useMediaQuery = (query) => {
  // it works like css media query
  //check if query match

  const client = typeof window === "object";

  const [match, setMatch] = useState(
    client ? matchMedia(query).matches : false
  );

  useEffect(() => {
    if (!client) {
      return false;
    }

    const mediaListObject = matchMedia(query);

    const handleResize = (e) => {
      setMatch(e.matches);
    };

    mediaListObject.addEventListener("change", handleResize);

    return () => mediaListObject.removeEventListener("change", handleResize);
  }, [query, client]);

  return match;
};

const useLocalStorage = (initialKey, initialValue) => {
  const storedValue = localStorage.getItem(initialKey);

  const value = storedValue ? JSON.parse(storedValue) : initialValue;

  !storedValue &&
    localStorage.setItem(initialKey, JSON.stringify(initialValue));

  const [stored, setStored] = useState(value);

  const updateValue = (newValue) => {
    setStored(newValue);
    localStorage.setItem(initialKey, JSON.stringify(newValue));
  };

  return { stored, updateValue };
};

export default withAuthenticator(App, {
  socialProviders: ["google", "facebook", "amazon"],
});
