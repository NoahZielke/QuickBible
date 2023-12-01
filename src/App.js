import "./app.css"
import Display from "./components/Display";
import fullText from "./fullText";


function App() {
    const fullTextConst = fullText();

    return (
        <div className="container-fluid">
            <div className="pb-4">
                <h3 className="main-title px-2 pt-2 mb-0">Quick Bible</h3>
                <p className="subtitle mt-0 ps-4 pe-2"><i>An ad-free, lighting-fast Bible search</i></p>
            </div>
            <Display fullText={fullTextConst} />
        </div>
    );
}

export default App;
