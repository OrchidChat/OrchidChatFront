export function Register() {

    async function submit(event) {
        event.preventDefault();

        const url = "http://localhost:8080/api/User/create"; // TODO: Endpoint hier einfügen sobald bereit mit Datenbank

        const userData = {
            firstname: event.target.firstname.value,
            lastname: event.target.lastname.value,
            email: event.target.email.value,
            password: event.target.password.value
        }

        console.log("Gesamellte User Daten", userData);

        const userResponse = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        })

        if (!userResponse.ok) {
            throw new Error(`Fehler bei User-Erstellung (Status: ${userResponse.status})`);
        } else {
            const savedUser = await userResponse.json();
            console.log("User erfolgreich angelegt:", savedUser);
        }
    }

    return (
        <>
            <h1>Register Site</h1>

            <form id={"register-form"} onSubmit={submit}>
                <label htmlFor="firstname">Enter a First Name: </label>
                <br/>
                <input type="text" id={"firstname"} name={"firstname"}/>
                <br/>

                <label htmlFor="lastname">Enter a Last Name: </label>
                <br/>
                <input type="text" id={"lastname"} name={"lastname"}/>
                <br/>


                <label htmlFor="email">Enter a E-Mail: </label>
                <br/>
                <input type="email" id={"email"} name={"email"}/>
                <br/>

                <label htmlFor="password">Enter Password: </label>
                <br/>
                <input type="password" id={"password"} name={"password"}/>
                <br/>

                <button type={"submit"}>Register in</button>
            </form>
        </>
    )
}

