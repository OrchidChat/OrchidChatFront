export function Login(){
    return(
        <>
            <h1>Login Site</h1>

            <form action="">
                <label htmlFor="email">Enter email: </label>
                <br/>
                <input type="email" id={"email"}/>
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

