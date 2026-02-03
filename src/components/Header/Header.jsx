import "./Header.css"

function Header() {
    return (
        <header className="header">
            <h2>CS2 Wheel</h2>
            <div>
                <span>{user?.username}</span>
                <button onClick={logout}>Logout</button>
            </div>
        </header>
    )
}

export default Header