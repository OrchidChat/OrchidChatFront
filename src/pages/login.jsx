export function Login(){
    return(
        <>
            <h1>Login Site</h1>

            <form action="">
                <label htmlFor="username">Enter Username: </label>
                <br/>
                <input type="text" id={"username"}/>
                <br/>
                <label htmlFor="password">Enter Password: </label>
                <br/>
                <input type="password" id={"password"}/>
                <br/>
                <button type={"submit"}>Log in</button>
            </form>
        </>
    )
}

