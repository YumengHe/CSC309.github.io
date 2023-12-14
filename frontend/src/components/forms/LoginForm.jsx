const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  error,
  handleLogin,
  navigateToRegister,
}) => {
  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6">
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn btn-primary-cust">
            Login
          </button>
          {error && <p className="text-danger mt-3">{error}</p>}
        </form>
        <div className="text-center mt-3">
          <span>Don&apos;t have an account? </span>
          <button onClick={navigateToRegister} className="btn btn-link">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
