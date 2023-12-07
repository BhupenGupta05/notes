const LoginForm = ({ handleSubmit,
  username, 
  password,
  setUsername, 
  setPassword}) => {

      
  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
        <div>
          Username : 
          <input type="text" name="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-slate-200 px-6 py-1 rounded-sm outline-none my-1" />
        </div>

        <div>
          Password : 
          <input type="text" name="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-200 px-6 py-1 rounded-sm outline-none my-1" />
        </div>
        <button type="submit" className="mx-2 bg-pink-400 rounded-sm px-4 py-1 hover:bg-pink-300">Login</button>
      </form>
    </div>
  )
}

export default LoginForm