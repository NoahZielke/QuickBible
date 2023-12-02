import "./app.css"
import Display from "./components/Display";
import KJVFullText from "./resources/KJVFullText";
import WEBFullText from "./resources/WEBFullText";


function App() {
    const KJV = KJVFullText();
    const WEB = WEBFullText();
    const versionList = [KJV, WEB];

    return (
        <div className="container-fluid">
            <div className="pb-1">
                <h3 className="main-title px-2 pt-2 mb-0">Quick Bible</h3>
                <p className="subtitle mt-0 ps-4 pe-2"><i>Ad-free, lighting-fast Bible search</i></p>
            </div>
            <Display versionList={versionList} />
        </div>
    );
}

export default App;
