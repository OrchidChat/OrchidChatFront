import API_URL from "../services/api";

export function Register() {
    async function submit(event) {
        event.preventDefault();

        const url = `${API_URL}/User/create`;

        const userData = {
            firstname: event.target.firstname.value,
            lastname: event.target.lastname.value,
            email: event.target.email.value,
            passwordHash: event.target.password.value
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
            alert("User Erfolgreich angelegt!");
            window.location.reload();
        }
    }

    return (
        <div className="page">
            <div className="card">
                <h1>Registrieren</h1>

                <form className="form" id="register-form" onSubmit={submit}>
                    <label htmlFor="firstname">Vorname</label>
                    <input type="text" id="firstname" name="firstname" required={true}/>

                    <label htmlFor="lastname">Nachname</label>
                    <input type="text" id="lastname" name="lastname" required={true}/>

                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" name="email" required={true}/>

                    <label htmlFor="password">Passwort</label>
                    <input type="password" id="password" name="password" required={true}/>

                    <button type="submit">Registrieren</button>
                </form>
            </div>
        </div>
    );
}

