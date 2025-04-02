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
                <h3 className="main-title px-3 pt-3 mb-0">🕮 Quick Bible</h3>
            </div>
            <div className="py-2"></div>
            <div className="container-fluid pt-4">
                <Display versionList={versionList} />
            </div>
        </div>
    );
}

export default App;
