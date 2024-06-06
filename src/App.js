import {
  useSpring,
  animated,
  useSpringRef,
  useSprings,
  useTransition,
  useTrail,
  useChain,
} from "@react-spring/web";
import logo from "./logo.svg";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { adder, editer, deleter, updater, selectAll } from "./reducers";
import { editing, dataFetcher } from "./actions";
import AppRoutes from "./router/appRoutes";
import AppNavBar from "./router/appNavbar";

function App() {
  const ref1 = useSpringRef();
  const ref2 = useSpringRef();

  const props = useSpring({
    ref: ref1,
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
    //    config: { duration: 20000 },
    //loop: true,
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
          React
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

export default App;
