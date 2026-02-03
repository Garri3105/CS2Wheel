const USERS_KEY = "users"

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || []
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function register(username, password) {
  const users = getUsers()

  if (users.find(u => u.username === username)) {
    throw new Error("User already exists")
  }

  const newUser = { id: Date.now(), username, password }
  users.push(newUser)
  saveUsers(users)

  return { id: newUser.id, username }
}

export function login(username, password) {
  const users = getUsers()

  const user = users.find(
    u => u.username === username && u.password === password
  )

  if (!user) {
    throw new Error("Invalid credentials")
  }

  return { id: user.id, username: user.username }
}
