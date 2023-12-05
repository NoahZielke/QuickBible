import "./app.css"
import Display from "./components/Display";
import KJVFullText from "./resources/KJVFullText";
import WEBFullText from "./resources/WEBFullText";


function App() {
    const KJV = KJVFullText();
    const WEB = WEBFullText();
    const versionList = [KJV, WEB];

    return (
        <div>
            <div className="title-container pb-1">
                <h3 className="main-title px-3 pt-3 mb-0">Quick Bible</h3>
                <p className="subtitle mt-0 ps-5 pe-2"><i>Ad-free, lighting-fast Bible search</i></p>
            </div>
            <div className="py-2"></div>
            <div className="container-fluid pt-4">
                <Display versionList={versionList} />
            </div>
        </div>
    );
}

export default App;
