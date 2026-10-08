export function Login(){
    return(
        <>
            <div className="page">
                <div className="card">
                    <h1>Login</h1>


                    <form className="form">
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" id="email"/>

                        <label htmlFor="password">Password</label>
                        <input type="password" id="password"/>

                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

