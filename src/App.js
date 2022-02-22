import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from "./Homepage";
import GamePage from "./GamePage";
import './index.css';


function App() {

    return (
        <>
        <Router basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route exact path='/' element={<Homepage/>} />
                <Route exact path='/game' element={<GamePage/>} />

            </Routes>
        </Router>
        
        </>
    );
}


export default App;
