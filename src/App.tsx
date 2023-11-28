import { FC } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";

import { Editor } from "./components";


interface AppProps { }

export const App: FC<AppProps> = () => {
    return (
        <Provider store={store}>
            <Editor />
        </Provider>
    );
};