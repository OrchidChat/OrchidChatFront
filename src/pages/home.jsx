export function Home(){
    return(
        <>
        <h1>Home Seite</h1>

            <div className="message">
                <form action="">
                    <label htmlFor="message">Enter a message: </label>
                    <input type="text" id={"message"}/>

                    <button type={"submit"}>Send</button>
                </form>
            </div>

            <div className="history">
                <h1>This is the Chathistory</h1>
            </div>
        </>
    )
}