import API_URL from "../services/api";
import { useNavigate } from "react-router-dom";

export function Login(){
    const navigate = useNavigate()
    async function login(event){
        event.preventDefault()
        const url = `${API_URL}/User/login`

        const userData = {
            email: event.target.email.value,
            passwordHash: event.target.password.value
        }
        console.log("Userdata", userData)

        try{
            const userResponse = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData),
                credentials: "include"
            })

            if (!userResponse.ok) {
                throw new Error(`Fehler beim Login (Status: ${userResponse.status})`);
            }

            const loggedInUser = await userResponse.json()
            console.log("LoggedUser",loggedInUser)

            localStorage.setItem("user", JSON.stringify((loggedInUser)))
            navigate("/home")
        }catch(error){
            console.error("Login fehlgeschlagen: ", error)
            alert("E-Mail oder Passwort ist falsch!")
        }


    }



    return(
        <>
            <div className="page">
                <div className="card">
                    <h1>Login</h1>

                    <form className="form" id="register-form" onSubmit={login}>
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" id="email" required={true}/>

                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" required={true}/>

                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

