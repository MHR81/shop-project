export default function DarkModeToggle({ darkMode, setDarkMode }) {
    return (
        <div className="toggleContainer" onClick={() => setDarkMode(!darkMode)}>
            <div className={`toggle${darkMode ? ' dark' : ''}`}>
                <div className={`circle${darkMode ? ' dark' : ''}`}>
                    <i className={`bi ${darkMode ? "bi-moon" : "bi-sun"} text-white`}></i>
                </div>
            </div>
        </div>
    );
}
